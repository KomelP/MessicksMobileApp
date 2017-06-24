var _URLTab = "http://messicks.com/mobileApi/usedEquip/GetTabs";
var _URLCategory = "http://messicks.com/mobileApi/usedEquip/GetCategory/";
//var _URLUnit = "http://localhost:9597/mobileApi/usedEquip/GetUnit/"

var app = {}
app.Tab = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: '',
        parentId: false,
        isTabHeader: false
    },
    idAttribute: 'id'
});
app.TabList = Backbone.Collection.extend({
    model: app.Tab,
    url: _URLTab
});
app.TabListView = Backbone.View.extend({
    el: '#tab',

    templateMain: _.template($('#tabHeader-template').html()),
    templateSub: _.template($('#tabList-template').html()),

    initialize: function () {
        this.render();
    },

    render: function () {
        tempSub = this.templateSub;
        tempMain = this.templateMain;
        var mainList = '';

        app.tabList.each(function (model) {
            if (model.get("isTabHeader")) {
                var subList = '';
                app.tabList.each(function (m) {
                    if (m.get("parentId") == model.get("id")) {
                        subList += tempSub({ itemName: m.get("name"), tabId: m.get("id") });
                    }
                });
                mainList += tempMain({ header: model.get("name"), tabListTemplate: subList });
            }
        });
        this.$el.html(mainList);
    },
});

app.Category = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: '',
        price: 0,
        status: '',
        store: '',
        description: '',
        tag: '',
        imageInfo: []
    },
    idAttribute: 'id'
})
app.CategoryList = Backbone.Collection.extend({
    model: app.Category,
    url: _URLCategory,
    initialize: function (models, options) {
        this.url = this.url + (options || {}).tabId;
    }
});
app.CategoryListView = Backbone.View.extend({
    el: '#categoryList',
    template: _.template($('#categoryList-template').html()),
    initialize: function () {
        this.render();
    },
    render: function () {
        var temp = this.template;
        var liList = '';
        app.categoryList.each(function (model) {
            liList += temp({
                id: model.get("id"),
                name: model.get("name"),
                price: model.get("price"),
                store: model.get("store"),
                status: model.get("status"),
                picSource: model.get("imageInfo")[0]
            });
        });
        this.$el.html(liList);
    }
});
app.UnitView = Backbone.View.extend({
    el: '#unit',
    template: _.template($('#unit-template').html()),
    templatePics: _.template($('#unitPics-template').html()),
    initialize: function () {
        this.render();
    },
    render: function () {
        var tempPics = this.templatePics;
        var imageList = '';

        var model = app.categoryList.get({ id: this.options.unitId });
        for (i = 0; i < model.get("imageInfo").length; i++)
        {
            imageList += tempPics({
                picSource: model.get("imageInfo")[i]
            });
        }
        this.$el.html(this.template({
                id: model.get("id"),
                name: model.get("name"),
                price: model.get("price"),
                store: model.get("store"),
                status: model.get("status"),
                description: model.get("description"),
                tag: model.get("tag"),
                unitPicsTemp: imageList
        }));
    }
});

//function GetCategoryData() {
    
//    app.categoryList = new app.CategoryList(null, { tabId: _selectedTab });
//    $.when(app.categoryList.fetch()).then(function () {
//        var temp = new app.CategoryListView();
//        $('#categoryList').listview('refresh');
//        $('#category-Page').find('#app-title').html(_tabHeader + " (" + app.categoryList.length + ")");
//    });
//}

//function GetUnitData() {
//    var temp = new app.UnitView({ unitId: _selectedUnit });
//    $('#unit-Page').find('#app-title').html(_unitHeader);
//}

var _selectedTab = '';
var _selectedUnit = '';
$(document).ready(function () {
    if (window.location.hash == '') {
        app.tabList = new app.TabList();
        $.when(app.tabList.fetch()).then(function () {
            var view = new app.TabListView();
            $('.tabListView').listview().listview('refresh');
            $('#tab').collapsibleset('refresh');
        });
    }

    $(document).on('click', 'li[data-tabid]', function () {
        var $this = $(this);
        _selectedTab = $this.data('tabid');
        app.categoryList = new app.CategoryList(null, { tabId: $this.data('tabid') });
        $.when(app.categoryList.fetch()).then(function () {
            var temp = new app.CategoryListView();
            $('#categoryList').listview('refresh');
            $('#category-Page').find('#app-title').html("Used " + $this.children('a').html() + " (" + app.categoryList.length + ")");
        });
        return true;
    });

    $(document).on('click', '.CategoryHead', function () {
        var temp = new app.UnitView({ unitId: $(this).data('unitid') });
        $('#unit-Page').find('#app-title').html("Used " + $(this).html().split('-')[0]);
        _selectedUnit = $(this).data('unitid');
        return true;
    });

    $("#ask-btn-submit").click(function () {
        if ($mess.Validation.IsGroupValid($("#ask-wrapper"))) {
            var data = {
                name: $('#name').val(),
                email: $("#email").val(),
                phone: $('#phone').val(),
                tagNumber: $('#unitTag').text(),
                question: $('#que').val()
            };
            var post = $.post('http://localhost:9597/mobileApi/usedEquip/submitQuestion', data, function () {

                alert('done');
                //$mess.Notifications.Popup('success', 'Thank you! We will respond shortly!', 1000);
                //$("#ask\\.Email, #ask\\.Name, #ask\\.Phone").val('');
            });
            //.fail(function (a) {
            //var response = $mess.Ajax.Response.Error.ParseXhr(a, true);
            //});
        }

        return false;
    });
});