$( function() {

	index = {
	};

	index.init = function() {
        // Bind events here
        $(document).on('click', '#sign-up-link', index.toggle_sign_up); // Bind sign up link
        $(document).on('click', '#sign-in-link', index.toggle_sign_in); // Bind sign in link
        $(document).on('submit', '#sign-in-form', index.sign_in_submit); // Bind sign up submission
        $(document).on('submit', '#sign-up-form', index.sign_up_submit); // Bind sign up submission

        // Set correct form for display
        if($("body").hasClass("sign-up")) {
            index.toggle_sign_up();
        }
	};
    
    index.toggle_sign_up = function(e) {
		console.log(e);
        e.preventDefault();
        $("#sign-up-form").show();
		$("#sign-in-form").hide();
    };
    
    index.toggle_sign_in = function(e) {
        e.preventDefault();
        $("#sign-up-form").hide();
		$("#sign-in-form").show();
    };
	
    index.sign_in_submit = function(e) {
        var error = false;

        // TODO: Add code to check various errors on client side
		

        // END TODO

        if ( error ) {
            e.preventDefault();
            $( '.error' ).html( error );
        }
    };

    index.sign_up_submit = function(e) {
        var error = false;
		var errorMessage="";

        // TODO: Add code to check various errors on the client side
		
		if ($("#sign-up-twitter").val().match('^@[a-zA-Z0-9_]*$')==null){
			errorMessage += "-Bad Twitter Handle";
			error=true;
		}
		if ($("#sign-up-url").val().match("^(https|http):\/\/www\.[A-Z0-9.\/_]*")==null){
			errorMessage += "-Bad URL";
			error=true;
		}
		if ($("#sign-up-name").val().match("[A-Za-z]+$")==null){
			errorMessage += "-Bad Name";
			error=true;
		}
		if ($("#sign-up-password").val().match("\w{4,}")==null){
			errorMessage += "-Bad Password";
			error=true;
		}
		if ($("#sign-up-email").val().match("[\w.\@")==null){
			errorMessage += "-Bad email";
			error=true;
		}

        if ( error ) {
            e.preventDefault();
            $( '.error' ).html( errorMessage );
			console.log(errorMessage);
        }
    };
    
    index.init();

} );