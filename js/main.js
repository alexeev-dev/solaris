$.fn.reverse = [].reverse;

$(document).ready(function() {
    
    // countdown
	if ($('.jsCounter').length) {
		$('.jsCounter').countdown("2017/01/01", function(event) {
			$(this).text(event.strftime('%H:%M:%S'));
		});
	}

	// navigation
	$('.landing_nav li a').click(function() {
		$('.landing_nav li').removeClass('active');
		$(this).parent().addClass('active');
		var miniOffset = ($(this).attr('href') == '#restr' ? 35 : 0);
		$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top - miniOffset}, 500);
		return false;
	});

	// anchor movement
	if (window.location.hash != '' && $(window.location.hash).length) {
		$('html, body').animate({scrollTop: $(window.location.hash).offset().top}, 500);
	}

	// accordion
    var allPanels = $('.jsAccordion > ul > li > p').hide();
    $('.jsAccordion > ul > li > p').eq(0).show();
	var accSpans = $('.jsAccordion > ul > li > span');
	accSpans.eq(0).addClass('active');
	
    accSpans.click(function() {
		if ($(this).hasClass('active')) return false;
		
		accSpans.removeClass('active');
		$(this).addClass('active');
		
        allPanels.slideUp();
        $(this).parent().find('p').slideDown();
        return false;
    });

    // carousel testimonials
    var owl = $('.jsCarousel-testimonials');
    owl.owlCarousel({
    	items: 1,
    	loop:true,
	    autoplay:true,
	    autoplayTimeout:2000,
	    autoplayHoverPause:true
    });

    owl.on('click', '.owl-item', function(){
	    $(this).trigger('next.owl.carousel');
	});

    // carousel courses
    if ($('.jsCarousel-courses').length) {
		var owl4 = $('.jsCarousel-courses');
		var owl4els = owl4.children('*');
		owl4.owlCarousel({
			items: 4,
			responsive:{
		        0:{
		            items:1
		        },
		        479:{
		            items:2
		        },
		        767:{
		            items:3
		        },
		        991:{
		            items:4
		        }
		    }
		});
		$('.js-carofilter a').click(function() {
			$('.js-carofilter li').removeClass('active');
			$(this).parent().addClass('active');
			
			$('.jsCarousel-courses').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			$('.jsCarousel-courses').find('.owl-stage-outer').children().unwrap();
			
			owl4.empty();
			owl4.append(owl4els);
			owl4.children(':not(' + $(this).attr('rel') + ')').remove();
			owl4.owlCarousel({
				items: 4,
				responsive:{
			        0:{
			            items:1
			        },
			        479:{
			            items:2
			        },
			        767:{
			            items:3
			        },
			        991:{
			            items:4
			        }
			    }
			});
			return false;
		});
	}

    // carousel works
    var owlWorksAuthor = $('.jsCarousel-author');
    var owlCounter = $(".owl-counter");

    owlWorksAuthor.on('initialized.owl.carousel', function(event) {
    	currPage = event.page.index + 1;
    	owlCounter.text('0' + currPage + '/0' + event.page.count);
	});

    owlWorksAuthor.owlCarousel({
    	items : 1,
    	loop : true,
	    autoplay : true,
	    autoplaySpeed : 1000,
	    autoplayTimeout : 2000,
	    autoplayHoverPause : true,
	    animateOut: 'fadeOut',
	    animateIn: 'fadeIn'
    });

    owlWorksAuthor.on('changed.owl.carousel', function(event) {
    	currPage = event.page.index + 1;
    	owlCounter.text('0' + currPage + '/0' + event.page.count);
	});

    // Go to the next item
	$(".owl-next").click(function() {
	    owlWorksAuthor.trigger("next.owl.carousel", [1000]);
	});
	
	// Go to the previous item
	$(".owl-prev").click(function() {
	    owlWorksAuthor.trigger("prev.owl.carousel", [1000]);
	});

    // parallax
	$.parallaxify({
		motionType: 'gaussian',
        mouseMotionType: 'performance'
	});

	// WOW
	new WOW().init();

	// validation
	$('.jsValidate').feelform({
        notificationType: 'class'
    });

    // fancybox
   $('.jsFancy a').fancybox();

   // popup
   $('.popupMe').click(function() {
	    $('#' + $(this).data('popup')).bPopup();
	    return false;
	});

   // slide for lesson-list
   /*$('.program-description .popupMe').click(function() {
   		$('#' + $(this).data('popup')).slideToggle(500);
   		// $('#popup1').slideToggle(500);
   		return false;
   });*/

});


$(window).scroll(function() {

	// menu active item on scroll
	$('.landing_nav li').removeClass('active');
	$('.landing_nav li a').reverse().each(function() {
		if ($($(this).attr('href')).offset().top < $(window).scrollTop() + 10) {
			$(this).parent().addClass('active');
			return false;
		}
	});

}).scroll();


$(window).load(function () {
	$('.preloader').fadeOut();
});