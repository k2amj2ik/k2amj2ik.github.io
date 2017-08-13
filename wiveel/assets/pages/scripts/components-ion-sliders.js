var ComponentsIonSliders = function() {

    var handleBasicDemo = function() {
        // year of creation
        $("#range_year").ionRangeSlider({
            type: "double",
            grid: true,
            min: 1911,
            max: 1987,
            from: 1911,
            to: 1987,
            prefix: "",
            max_postfix: " and others"
        });

        // sold price
        $("#range_price").ionRangeSlider({
            type: "double",
            grid: true,
            min: 360,
            max: 1250,
            from: 360,
            to: 1250,
            prefix: "$ ",
            max_postfix: " and others"
        });

        // estimated price
        $("#range_estimate").ionRangeSlider({
            type: "double",
            grid: true,
            min: 360,
            max: 1250,
            from: 360,
            to: 1250,
            prefix: "$ ",
            max_postfix: " and others"
        });

        // size
        $("#range_size").ionRangeSlider({
            type: "double",
            grid: true,
            min: 30,
            max: 156,
            from: 30,
            to: 156,
            prefix: "",
            postfix: "",
            max_postfix: " and others"
        });


        // demo 1
        $("#range_1").ionRangeSlider();

        // demo 2
        $("#range_2").ionRangeSlider({
            min: 100,
            max: 1000,
            from: 550
        });

        // demo 3
        $("#range_3").ionRangeSlider({
            type: "double",
            grid: true,
            min: 0,
            max: 1000,
            from: 200,
            to: 800,
            prefix: "$"
        });

        // demo 4
        $("#range_4").ionRangeSlider({
            type: "double",
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500
        });

        // demo 5
        $("#range_5").ionRangeSlider({
            type: "double",
            grid: true,
            from: 1,
            to: 5,
            values: [0, 10, 100, 1000, 10000, 100000, 1000000]
        });

        // demo 6
        $("#range_6").ionRangeSlider({
            grid: true,
            from: 5,
            values: [
                "zero", "one",
                "two", "three",
                "four", "five",
                "six", "seven",
                "eight", "nine",
                "ten"
            ]
        });

        // demo 7
        $("#range_7").ionRangeSlider({
            grid: true,
            from: 3,
            values: [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ]
        });

        // demo 8
        $("#range_8").ionRangeSlider({
            type: "double",
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: "Weight: ",
            postfix: " million pounds",
            decorate_both: true
        });

        // demo 9
        $("#range_9").ionRangeSlider({
            type: "double",
            min: 100,
            max: 200,
            from: 148,
            to: 152,
            prefix: "Weight: ",
            postfix: " million pounds",
            values_separator: " → "
        });
    }

    var handleAdvancedDemo = function() {
        $("#range_10").ionRangeSlider({
            type: "double",
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            from_fixed: true
        });

        $("#range_11").ionRangeSlider({
            min: 0,
            max: 100,
            from: 30,
            from_min: 10,
            from_max: 50
        });

        $("#range_12").ionRangeSlider({
            type: "double",
            min: 0,
            max: 100,
            from: 20,
            from_min: 10,
            from_max: 30,
            from_shadow: true,
            to: 80,
            to_min: 70,
            to_max: 90,
            to_shadow: true,
            grid: true,
            grid_num: 10
        });

        $("#range_13").ionRangeSlider({
            min: 0,
            max: 100,
            from: 30,
            disable: true
        });
    }

    return {
        //main function to initiate the module
        init: function() {
            handleBasicDemo();
            handleAdvancedDemo();
        }

    };

}();

jQuery(document).ready(function() {
    ComponentsIonSliders.init();
});