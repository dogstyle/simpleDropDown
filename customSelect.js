PAGE.addFunction("customSelect", function($select, options) {


	options = options || { }
	options.onClick = options.onClick || function() {}
	options.onChange = options.onChange || function() {}

	var dog = {
		$select : $select
		, $fake : $("<span class='customSelect'></span>")
		, $dropDown : $("<div class='customSelectDropDown'></div>")
		, $selectedTop : $("<div class='selectedTop'><i class='icon-chevron-down'></i></div>")
		, $selectedOption : undefined
		, isGenerated : false
		, items : undefined
		, isOpen : false
		, polling : undefined
		, options : options
		, onClickEvents : []
		, onChangeEvents : []
		, onHideEvents : []
		, onClick : function(func) {
			dog.onClickEvents.push(func)
		}
		, onChange : function(func) {
			dog.onChangeEvents.push(func)
		}
		, onHide : function(func) {
			dog.onHideEvents.push(func)
		}
	}

	dog.onClick(options.onClick)
	dog.onChange(options.onChange)

	dog.triggers = {
		change : function(e) {
			var value = $(this).val()
				, $item = dog.$dropDown.children("[go=" + value + "]")

			setTimeout(function() {
				findSelected()
			}, 50)
			buildSelect()

			for(var x in dog.onChangeEvents) dog.onChangeEvents[x]()
		}
		, click : function(e) {

			$(document).unbind("keydown").keyup(function (e) {
				if (e.keyCode == 13 || e.KeyCode == 9) {
					dog.triggers.hide(e)
				}
			})

			if (!dog.isOpen) {
				dog.$fake.addClass("selected")
				dog.$dropDown.addClass("customSelectDropDownSelected")
				dog.isOpen = true
			} else {
				dog.$fake.removeClass("selected")
				dog.$dropDown.removeClass("customSelectDropDownSelected")
				dog.isOpen = false
			}

			for(var x in dog.onClickEvents) dog.onClickEvents[x]()
		}
		, hide : function(e) {
			dog.$fake.removeClass("selected")
			dog.$dropDown.removeClass("customSelectDropDownSelected")
			dog.isOpen = false
			for(var x in dog.onHideEvents) dog.onHideEvents[x]()
		}
	}

	function events() {
		dog.$select.on("change", dog.triggers.change)
		dog.$fake.on("click", dog.triggers.click)
		dog.$select.on("focus", dog.triggers.click)
	}

	function optionTrigger(id) {
		var $item = dog.$select.val(id)
		setTimeout(function() {
			$item.trigger("change")
		}, 150)
	}

	function buildSelect() {
		dog.$dropDown.empty()
		dog.items = $select.children("option")

		dog.items.each(function() {
			var $item = $(this)
				, value = $item.val()
				, $html = $("<div class='foption' go='" + value + "'>" + $item.html() + "</div>")

			$html.click(function() {
				if (dog.isOpen) {
					optionTrigger(value)
					findSelected()
				} else {
					findSelected()
				}
			})

			dog.$dropDown.append($html)
		})

		dog.$fake.append(dog.$dropDown)
		dog.$fake.append(dog.$selectedTop)
	}

	function findSelected() {
		var $temp = dog.$select.find(":selected").eq(0)
		var $selectedChild = dog.$dropDown.children("[go=" + $temp.val() + "]").eq(0).addClass("selected")
		$selectedChild.siblings().removeClass("selected")
		dog.$selectedTop.empty()
		dog.$selectedTop.html($selectedChild.clone(false))
		dog.$selectedTop.append("<i class='icon-chevron-down'></i>")
	}

	function init() {

		buildSelect()
		findSelected()

		dog.isGenerated = $select.data("styled") == true

		if (!dog.isGenerated) {
			dog.$select.after(dog.$fake)
			dog.isGenerated = true
			dog.$select.addClass("slyhide")
			$select.data("styled", true)
		}

		events()
	}

	init()

	return dog
})
