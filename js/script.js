$(document).ready(function(){
  var $body = $('body');
  var $window = $(window);

  function menuHideExtraElements() {
	
    //cleaneng changed elements
    $('.sf-more-li, .sf-logo-li').remove();
    var windowWidth = $('body').innerWidth();
    
    $('.sf-menu').each(function(){
      var $thisMenu = $(this);
      var $menuWraper = $thisMenu.closest('.mainmenu_wrapper');
      $menuWraper.attr('style', '');
      if (windowWidth > 991) {
        //grab all main menu first level items 
        var $menuLis = $menuWraper.find('.sf-menu > li');
        $menuLis.removeClass('sf-md-hidden');
  
        var $headerLogoCenter = $thisMenu.closest('.header_logo_center');
        var logoWidth = 0;
        var summaryLiWidth = 0;
        
        if ( $headerLogoCenter.length ) {
          var $logo = $headerLogoCenter.find('.logo');
          // 30/2 - left and right margins
          logoWidth = $logo.outerWidth(true) + 70;
        }
  
        // var wrapperWidth = $('.sf-menu').width();
        var wrapperWidth = $menuWraper.outerWidth(true);
        $menuLis.each(function(index) {
          var elementWidth = $(this).outerWidth();
          summaryLiWidth += elementWidth;
          if(summaryLiWidth >= (wrapperWidth-logoWidth)) {
            var $newLi = $('<li class="sf-more-li"><a>...</a><ul></ul></li>');
            $($menuLis[index - 1 ]).before($newLi);
            var newLiWidth = $($newLi).outerWidth(true);
            var $extraLiElements = $menuLis.filter(':gt('+ ( index - 2 ) +')');
            $extraLiElements.clone().appendTo($newLi.find('ul'));
            $extraLiElements.addClass('sf-md-hidden');
            return false;
          }
        });
  
        if ( $headerLogoCenter.length ) {
          var $menuLisVisible = $headerLogoCenter.find('.sf-menu > li:not(.sf-md-hidden)');
          var menuLength = $menuLisVisible.length;
          var summaryLiVisibleWidth = 0;
          $menuLisVisible.each(function(){
            summaryLiVisibleWidth += $(this).outerWidth();
          });
  
          var centerLi = Math.floor( menuLength / 2 );
          if ( (menuLength % 2 === 0) ) {
            centerLi--;
          }
          var $liLeftFromLogo = $menuLisVisible.eq(centerLi);
          $liLeftFromLogo.after('<li class="sf-logo-li"></li>');
          $headerLogoCenter.find('.sf-logo-li').width(logoWidth);
          var liLeftRightDotX = $liLeftFromLogo.offset().left + $liLeftFromLogo.outerWidth();
          var logoLeftDotX = windowWidth/2 - logoWidth/2;
          var menuLeftOffset = liLeftRightDotX - logoLeftDotX;
          $menuWraper.css({'left': -menuLeftOffset})
        }
        
      }// > 991
    }); //sf-menu each
  } //menuHideExtraElements

  function initMegaMenu() {
    var $megaMenu = $('.mainmenu_wrapper .mega-menu');
    if($megaMenu.length) {
      var windowWidth = $('body').innerWidth();
      if (windowWidth > 991) {
        $megaMenu.each(function(){
          var $thisMegaMenu = $(this);
          //temporary showing mega menu to propper size calc
          $thisMegaMenu.css({'display': 'block', 'left': 'auto'});
          var thisWidth = $thisMegaMenu.outerWidth();
          var thisOffset = $thisMegaMenu.offset().left;
          var thisLeft = (thisOffset + (thisWidth/2)) - windowWidth/2;
          $thisMegaMenu.css({'left' : -thisLeft, 'display': 'none'});
          if(!$thisMegaMenu.closest('ul').hasClass('nav')) {
            $thisMegaMenu.css('left', '');
          }
        });
      }
    }
  }
  
  if ($().scrollbar) {
		$('[class*="scrollbar-"]').scrollbar();
	}
	if ($().superfish) {
		$('ul.sf-menu').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       700,
			animation:   {opacity:'show', marginTop: 0},
			animationOut: {opacity: 'hide',  marginTop: 5},
			speed:       200,
			speedOut:    200,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true

		});
		$('ul.sf-menu-side').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       500,
			animation:   {opacity:'show', height: 100 +'%'},
			animationOut: {opacity: 'hide',  height: 0},
			speed:       400,
			speedOut:    300,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true
		});
  }
  
  	//toggle mobile menu
	$('.toggle_menu').on('click', function(){
		$(this)
			.toggleClass('mobile-active')
				.closest('.page_header')
				.toggleClass('mobile-active')
				.end()
				.closest('.page_toplogo')
				.next()
				.find('.page_header')
				.toggleClass('mobile-active');
  });
  
  $('.mainmenu a').on('click', function(){
		var $this = $(this);
		//If this is a local link or item with sumbenu - not toggling menu
		if (($this.hasClass('sf-with-ul')) || !($this.attr('href').charAt(0) === '#')) {
			return;
		}
		$this
		.closest('.page_header')
		.toggleClass('mobile-active')
		.find('.toggle_menu')
		.toggleClass('mobile-active');
	});

	//side header processing
	var $sideHeader = $('.page_header_side');
	// toggle sub-menus visibility on menu-click
	$('ul.menu-side-click').find('li').each(function(){
		var $thisLi = $(this);
		//toggle submenu only for menu items with submenu
		if ($thisLi.find('ul').length)  {
			$thisLi
				.append('<span class="activate_submenu"></span>')
				//adding anchor
				.find('.activate_submenu, > a')
				.on('click', function(e) {
					var $thisSpanOrA = $(this);
					//if this is a link and it is already opened - going to link
					if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
						e.preventDefault();
					}
					if ($thisSpanOrA.parent().hasClass('active-submenu')) {
						$thisSpanOrA.parent().removeClass('active-submenu');
						return;
					}
					$thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
				});
		} //eof sumbenu check
	});
	if ($sideHeader.length) {
		$('.toggle_menu_side').on('click', function(){
			var $thisToggler = $(this);
			if ($thisToggler.hasClass('header-slide')) {
				$sideHeader.toggleClass('active-slide-side-header');
			} else {
				if($thisToggler.parent().hasClass('header_side_right')) {
					$body.toggleClass('active-side-header slide-right');
				} else {
					$body.toggleClass('active-side-header');
				}
			}
		});
		//hidding side header on click outside header
		$body.on('click', function( e ) {
			if ( !($(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('page_header_side_sticked')) ) {
				$sideHeader.removeClass('active-slide-side-header');
				$body.removeClass('active-side-header slide-right');
			}
		});
	} //sideHeader check



  });

function newFunction() {
  return 'mobile-active';
}
