window.Routy or = {}
History = window.History

last_route = {}

# The router, used to manage and store the actions
class Routy.Router

    # List of registered actions
    actions: []

    # Generate the router to a specific routing context
    # @state_changers_selector: String containing the selector of the elements that will trigger the pushState event
    # 	default: 'a' (all links)
    # context_selector: String containing the selector of the container of the elements that will trigger the pushState event
    #	default: 'document' (will search inside the document)
    constructor: (context, @state_changers_selector, context_selector, @event)->

        # Let's clean the context variable
        context or = ''

        if context != ''
            if context[0] == '/'
                context = context.substr 1

            if context.substr(-1) == '/'
                context = context.substr 0, context.length-1

        @context = context

        @state_changers_selector or = 'a'

        context_selector or = document

        @context_selector = $ context_selector

        @event or = 'click'

        @attach()

    # Apply the current context to the specified url
    apply_context: (url)->
        if url != ''
            if url[0] != '/'
                url = @context + url
            else
                url = @context + url
        else
            url = @context + '/'

        url

    # Listen for clicks in the elements that will trigger the pushState event
    attach: ->
        # 'cause "this" will be replaced with the clicked element
        router = @

        # go to the route page by default
        $(window).load (e) =>
            router.run.call router, window.location.pathname + window.location.search

        @context_selector.on @event, @state_changers_selector, (e)->
            href = $(@).attr('href') || $(@).children('a').attr('href') || ''
            if href.indexOf('http://') == 0 or href.indexOf('https://') == 0 or href == ''
                return
            else
                e.preventDefault()
                router.run.call router, href, e.type if href?

        # Create an anonymous function to call the router.run method so we can
        # pass the router as "this" variable
        $(window).bind 'popstate', (e)->
            router.run.call router, e.state['state']

    # Redirect (using pushState) to a specific page
    go: (url, title, data)->
        hash = data or {}
        hash['state'] = url
        window.history.pushState hash, title or document.title, url

    # Register a new action
    register: (uri, route) ->
        template_url = route.template_url
        events       = route.events or @event.split(' ')
        context      = route.context
        resolve      = route.resolve
        before       = route.before_enter
        enter        = route.on_enter
        after        = route.after_enter
        exit         = route.on_exit

        new_route = new Routy.Action uri, template_url, events, $(context), @, resolve, before, enter, after, exit

        @actions.push new_route

    # delegate to register method
    rootRegister: (route) ->
        @register '/', route

    run: (uri, event) ->

        # always try to get the current user first
        $.ajax
            url: API_DOMAIN + '/api/current_user'
            dataType: 'json'
            xhrFields:
                withCredentials: true
        .done (data) =>
            #the user has logged in
            if data.data
                if !@current_user
                    @current_user = data.data
                    @updateDOM @current_user
        .fail ->
            alert 'Failed to load current user'
        .always =>
            #first try to find if there is any matching route
            for action in @actions
                if !event or (event and (event in action.events))
                    for route in action.route
                        regex = (@pathRegExp route, {}).regexp
                        match = uri.match(regex)
                        if match?
                            @.go uri
                            match.shift()
                            return action.call(match...)

            #if no route is found, try default route
            @.run '/'

    updateDOM: (current_user) ->
        $("a.nav-login").attr('href','/user/' + current_user['global_key'])
        imageUrl = current_user['avatar'];
        if imageUrl.indexOf('/static') == 0
            imageUrl = 'https://coding.net' + imageUrl
    
        $(".nav-login img").attr('src', imageUrl).css('border-radius','34px')
        $(".nav-login span").text(current_user['name'])

        if current_user['status'] == 0
            tipHtml = '<div class="activate-tip">欢迎注册 coding, 请尽快去邮箱查收邮件并激活账号<span class="activate-tip-close">&nbsp;</span></div>'
            $("nav.navbar-coding").after(tipHtml)
            if window.innerHeight < 600
                $(".activate-tip").css('font-size','12px')
                $('.activate-tip-close').css('width','10px')

            $('span.activate-tip-close').click (e)->
                                        $('.activate-tip').remove()

        logoutTemplate = '<li>' + 
                              '<a class="nav_logout"><img src="/images/icons/logout.png" class="nav-icon"><span>退出</span></a>' + 
                           '</li>'

        $("#navigator").append(logoutTemplate)

        $('a.nav_logout').click (e)->
                          $.ajax
                            url: API_DOMAIN + '/api/logout',
                            type: 'POST',
                            dataType: 'json',
                            xhrFields: 
                                withCredentials: true  
                          .done ->
                            window.location = '/';
                          .fail ->
                            alert('Failed to logout');
          

    # Checks if the route matches with the current uri
    pathRegExp: (path, opts) ->
        insensitive = opts.caseInsensitiveMatch
        ret =
            originalPath: path
            regexp: path

        keys = ret.keys = []
        path = path.replace('?','\\?');
        path = path.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, (_, slash, key, option) ->
            optional = (if option is "?" then option else null)
            star = (if option is "*" then option else null)
            keys.push
                name: key
                optional: !!optional

            slash = slash or ""
            "" + ((if optional then "" else slash)) + "(?:" + ((if optional then slash else "")) + (star and "(.+?)" or "([^/]+)") + (optional or "") + ")" + (optional or "")
        ).replace(/([\/$\*])/g, "\\$1")
        ret.regexp = new RegExp("^" + path + "$", (if insensitive then "i" else ""))
        ret





# Class representing an action
class Routy.Action

    # Routes this action with handle
    route: []

    #the context where template should override to
    context: $("body")
    # template url of the route
    template_url: null

    # template for a particular route
    template: null

    # The callback to execute
    callback: null

    # The resolve object
    resolve: null

    # Callback to execute before the action
    before_callback: null

    # Callback to execute after the action
    after_callback: null

    # Condition to execute the action
    condition: null

    on_exit_callback: null

    events: []

    # Create a new action
    constructor: (routes, @template_url, @events, @context, @router, @resolve, @before_callback, @callback, @after_callback, @on_exit_callback)->
        # so you can call it like: new Routy.Action(['/', 'home'], callback)
        # or: new Routy.Action('/, home', callback);
        routes = routes.split ', ' if typeof routes == 'string'

        arr = []

        @events = @events or []

        for route in routes
            route = @router.apply_context route

            arr.push route

        @route = arr

    # Call the action passing arguments to it
    call: (args...)->
        # for now we can call the action
        result = true

        # call the condition
        if @condition
            result = @condition.apply @, args

        # if it returned false when can't call the action
        false if ! result

        if @resolve
            @resolve(args...)
            .then (data) =>
                if(data.data)
                    args.push(data.data)
                    return @cacheTemplate(args)
                else
                    return @cacheTemplate(args)
            ,() ->
                alert('Failed to resolve promise')

            .then (data) =>
                @digest(data)
        else
            @cacheTemplate(args)
            .then (data) =>
                @digest(data)

    cacheTemplate: (data) ->
        deferred = $.Deferred()
        #if template has been fetched before, then get it from cache
        if @template
            deferred.resolve(data)
        #otherwise, get it from template_url
        else
            $.get @template_url, (template) =>
                @template = template
                deferred.resolve(data)

        return deferred.promise()

    digest: (args) ->

        # first run on exit in last route
        if last_route.on_exit_callback?
            last_route.on_exit_callback.apply @, args

        # if we defined a callback to execute before the action
        if @before_callback
            # execute it passing the same arguments as the action
            @before_callback.apply @, args

        # render the template
        @context.html(@template)

        # call the action callback and fetch the contents of it
        @callback.apply @, args

        # if we defined some callback to execute after the main one
        if @after_callback
            # call it passing the returned content
            @after_callback.apply @, args


        #register for the last route
        last_route = @
