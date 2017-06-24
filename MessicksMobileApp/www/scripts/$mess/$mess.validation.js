var $mess = (function ($mess) {

    $mess.Validation = {
        AddMessages: function (selector, type, errors) {
            $item = $(selector);

            var list = $("<ul>");
            for (var i = 0; i < errors.length; i++) {
                list.append("<li>" + errors[i] + "</li>");
            }
            $item.removeClass('alert-success').removeClass('alert-danger').removeClass('alert-warning').removeClass('alert-info');
            $item.addClass('alert alert-' + type).empty().append(list);
            
            setTimeout(function () {
                $item.slideDown().scrollToTop({
                    offset: -75
                });
            }, 0);
        },
        ClearMessages: function (selector) {
            var dfd = new jQuery.Deferred();

            if ($(selector).height() > 0) {
                $(selector).slideUp({
                    complete: function () {
                        dfd .resolve();
                    }
                });
            }
            else {
                setTimeout(function () {
                    dfd.resolve();
                }, 0);
            }

            return dfd.promise();
        },

        GetLabel: function ($item) {
			var label = jQuery("label[for='" + $item.attr('id') + "']");
			return label;
		},

		ValidationPopup: function ($item, message) {
			var $popup = jQuery("<div class='validation-popup'><div></div><div class='validation-popup-message'>" + message + "</div></div>")
			$popup.appendTo("body");

			$popup.position({
				of: $item,
				my: "left top",
				at: "left bottom+5",
				collision: 'none'
			}).show();

			setTimeout(function () {
				$item.focus();
				//$item.scrollintoview();
			}, 10);

			setTimeout(function () {
				$popup.fadeOut(function () {
					$popup.remove();
				});
			}, 1500);
		},

		IsGroupValid: function ($group) {
		    var hasErrors = false;

		    function addError($this, error) {
		        $this.addClass('has-error');

		        var $label = $mess.Validation.GetLabel($this);
		        if ($label) {
		            $label.addClass('has-error');
		        }

		        if (!hasErrors) {
		            $mess.Validation.ValidationPopup($this, error);
		        }

		        hasErrors = true;
		    }

		    /* check required */
		    $group.find("[required]:visible").each(function () {
		        var $this = jQuery(this);
		        var error = $this.data('val-required') ? $this.data('val-required') : 'This field is required!';

		        if ($this.is(':radio')) {
		            var value = $group.find("[name='" + $this.attr('name') + "']:checked").val();

		            if (!value) {
		                addError($this, error);
		            }
		        }
		        else if ($this.is(":text") || $this.is(":password") || $this.is("select") || $this.is("textarea")) {
		            if (!$this.val()) {
		                addError($this, error);
		            }
		        }
		    });

		    /* check email */
		    $group.find("[data-val-email]:visible").each(function () {
		        var $this = jQuery(this);
		        var error = $this.data('val-email') ? $this.data('val-email') : 'This field is not a valid email!';

		        var val = $this.val();
		        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		        if (!re.test(val)) {
		            addError($this, error)
		        }
		    });

		    return !hasErrors;
		},

		IsPageValid: function () {
		    return $mess.Validation.IsGroupValid($(document));
		}
	};

	return $mess;
}($mess || {}));