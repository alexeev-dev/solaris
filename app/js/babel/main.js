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

	// toogle header
	$('.dropdown-toggle').click(function(){
		$('.dropdown-nav').toggleClass('active');
	});

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

	// isotope
	var container = $('.js-courseItems').isotope({
		itemSelector: '.js-courseItems > div',
		masonry: {}
	});
	// course filter
	$('.js-courseFilter a').click(function() {
		$('.js-courseFilter li').removeClass('active');
		$(this).parent().addClass('active');

		var filterValue = $(this).attr('data-filter');
		container.isotope({filter: filterValue});
		return false;
	});

	// section img
	$('.figures img').each(function() {
		var sectionAttr = $(this).data('section');
		$(sectionAttr).append(this);
	});

});

class PaymentController 
{
	/**
	* Создаёт экземпляр контроллера
	*/
	constructor(params) {
	// Инициализируем наши вьюшки
	this.view = {
		paymentButton: $('.payment_button'),
		tariffTitle: $('.do_select .tarif-type'),
		container: $('.payment_do'),
		promo: $('.do_promo input'),
		monthCount: $('.js-tarif span'),
		discount: $('.payment_discount p'),
		currency: $('.js-converter strong'),
		converterButton: $('.js-converter ul li'),
		price: {
			old: $('.do_action strike'),
			final: $('.do_action input')
		}
	}
	// Изначальное состояние модели
	this.model = {
		isPromo: false,
		priceBase: 0,
		mainDiscount: 0.7,
		promoDiscount: 0,
		trainingTerm: 1,
		exchangeRate: 1
	}
	// Тарифы и промо-коды передаются как параметры
	// при создании контроллера
	this.tariffs = params.tariffs;
	this.promoCodes = params.promoCodes;
	// Обновляем вьюшку при вводе промокода
	this.view.promo.keydown((event) => this.updatePromo());
	// Триггер для первого тарифа
	$('.js-pay1').click((event) => {
		this.showTariff(0);
		return false;
	});
	// Триггер для второго тарифа
	$('.js-pay2').click((event) => {
		this.showTariff(1);
		return false;
	});
	// При изменении количества месяцев, обновляем вьюшку
	this.view.monthCount.each((index, self) => {
		$(self).click((event) => {
			this.view.monthCount.removeClass('active')
			.eq(index).addClass('active');
			this.updateMonth(index);
			return false;
		});
	});
	// Изменение валюты
	this.view.converterButton.each((index, self) => {
		let current = $(self);
		let title = current.text();
		let rate = current.data('converter');
		current.click((event) => {
			this.view.converterButton.removeClass('active')
			.eq(index).addClass('active');
			this.updateCurrency(title, rate);
		});
	});
}

	/**
	* Показать указанный тариф
	*/
	showTariff(id)
	{
		let tariff = this.tariffs[id];
		this.view.paymentButton.hide().eq(id).show();
		this.view.tariffTitle.text(tariff.title);
		this.model.priceBase = tariff.price;
		this.view.container.show();
		this.updateInfo();
	}

	/**
	* Считывает данные из поля для промо-кода
	* и обновляет всю вьюшку
	*/
	updatePromo()
	{
	// Вызываем с небольшой задержкой для того чтобы были
	// считаны свежие данные
	setTimeout(() => {
		let promoValue = this.view.promo.val();
		let promoCodes = this.promoCodes;
		// Проверяем, существует ли введённый промокод,
		// и, если это так, считываем значение скидки и
		// указываем, что промо-код активирован. В противном
		// случае сбрасываем все значения на изначальные
		if (promoCodes.hasOwnProperty(promoValue)) {
			this.model.promoDiscount = promoCodes[promoValue];
			this.model.isPromo = true;
		} else {
			this.model.promoDiscount = 0;
			this.model.isPromo = false;
		}
		// Обновляем вьюшку
		this.updateInfo();
	}, 25);
}

	/**
	* Считывает количество месяцев и обновляет вьюшку
	*/
	updateMonth(index)
	{
		this.model.mainDiscount = this.view.monthCount.eq(index).data('disc');
		this.model.trainingTerm = index + 1;
		this.updateInfo();
	}

	/**
	* Обновить валюту и вьюшку
	*/
	updateCurrency(title, rate)
	{
		this.view.currency.text(title);
		this.model.exchangeRate = rate;
		this.updateInfo();
	}

	/**
	* Отобразить свежие данные
	*/
	updateInfo()
	{
		/* Получаем компоненты вьюшки */
		let {promo, price, discount} = this.view;
		/* Получаем свежую информацию */
		let {
			priceBase, mainDiscount, promoDiscount,
			trainingTerm, exchangeRate, isPromo
		} = this.model;
		/* Вычисляем размер скидки и цены */
		let discountValue = mainDiscount - promoDiscount;
		let discountText = Math.round((1 - discountValue) * 100) + '%';
		let oldPrice = priceBase * trainingTerm * exchangeRate;
		let finalPrice = oldPrice * discountValue;
		/* Если промокод активирован, оповещаем об этом пользователя */
		if (isPromo) {
			promo.addClass('active');
		} else {
			promo.removeClass('active');
		}
		/* Выводим информацию о ценах */
		price.old.text(Math.round(oldPrice));
		price.final.attr('value', Math.round(finalPrice));
		/* Выводим информацию о скидке */
		discount.text(discountText);
	}
}

let paymentController = new PaymentController({
	// Перечисляем тарифы
	tariffs: [
	{
		title: 'Тариф «индивидуальный» за',
		price: 300
	},
	{
		title: 'Тариф «в группе» за',
		price: 200
	}
	],
	// Перечисляем промо-коды ('код':дискаунт)
	promoCodes: {
		'promo1': 0.1,
		'promo2': 0.2,
		'promo3': 0.3
	}
});

$(window).scroll(function () {

	// menu active item on scroll
	$('.landing_nav li').removeClass('active');
	$('.landing_nav li a').reverse().each(function () {
		if ($($(this).attr('href')).offset().top < $(window).scrollTop() + 10) {
			$(this).parent().addClass('active');
			return false;
		}
	});

}).scroll();


$(window).load(function () {
	$('.preloader').fadeOut();
});
