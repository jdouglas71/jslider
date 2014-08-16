$(document).ready(function() {

	var slideShow = $('#slideShow'),
		ul = slideShow.find('ul'),
		li = ul.find('li'),
		cnt = li.length;

	//As the images are positioned absolutely, the last image will be shown on top.
	//This is why we force them in the correct order by assigning z-indices.
	
	updateZIndex();

	if( $.support.transform)
	{
		//Modern browsers with support for css3 transformations

		li.find('img').css('rotate', function(i){
			//Rotating the images counter-clockwise.
			return (-90*i) + 'deg';
		});

		//Binding a custom event. The direction and degrees parameters
		//are passed when the event is triggered later on in the code.
		slideShow.bind('rotateContainer', function(e,direction,degrees) {
			//Zooming in the slideshow
			slideShow.animate({
				width: 510,
				height: 510,
				marginTop: 0,
				marginLeft: 0
			},'fast',function(){
				 if( direction == 'next' )
				 {
					 //Moving the topmost image containing li at
					 //the bottom after a fadeOut animation
					 $('li:first').fadeOut('slow', function() {
						 $(this).remove().appendTo(ul).show();
						 updateZIndex();
					 });
				 }
				 else
				 {
					 //Showing the bottom most li element on top with a fade in animation.
					 //Note that we are updating the z indices.
					 var liLast = $('li:last').hide().remove().prependTo(ul);
					 updateZIndex();
					 liLast.fadeIn('slow');
				 }

				 slideShow.animate({
					 rotate:Math.round($.rotate.radToDeg(slideShow.css('rotate'))+degrees) + 'deg'
				 },'slow').animate({
						width: 490,
						height: 490,
						marginTop: 10,
						marginLeft: 10
				 },'fast');
			});
		});

		//By Triggering the custom events below, we can
		//show the previous/next images in the slideshow
		slideShow.bind('showNext',function() {
			slideShow.trigger('rotateContainer',['next',90]);
		});

		slideShow.bind('showPrevious',function(){
			slideShow.trigger('rotateContainer',['previous',-90]);
		});
	}
	else
	{
		//Fallback for IE and older browsers
		slideShow.bind('showNext',function(){
			$('li:first').fadeOut('slow',function(){
				$(this).remove().appendTo(ul).show();
				updateZIndex();
			});
		});

		slideShow.bind('showPrevious',function() {
			var liLast = $('li:last').hide().remove().prependTo(ul);
			updateZIndex();
			liLast.fadeIn('slow');
		});
	}

	//Listening for clicks on the arrows, and
	//triggering the appropriate event.
	$('#previousLink').click(function() {
		if( slideShow.is(':animated') ) 
		{
			return false;
		}

		slideShow.trigger('showPrevious');
		return false;
	});

	$('#nextLink').click(function() {
		if( slideShow.is(':animated') )
		{
			return false;
		}

		slideShow.trigger('showNext');
		return false;
	});

	// This function updates the z-index properties
	function updateZIndex()
	{
		//The CSS method can take a function as its second argument.
		// i the zero-based index of the element.
		ul.find('li').css('z-index',function(i) {
			return cnt-i;
		});
	}
});
