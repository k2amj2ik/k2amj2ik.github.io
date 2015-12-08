/**
 * Copyright (c) 2011 Nick Taylor (nick@webnick.ca)
 * 
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Based on the API provided by the ASP.NET AJAX Sys.StringBuilder class.
 *
 * Home Page: http://nickandtheinternet.com/page/jQuery-StringBuilder-Plugin.aspx
 */
(function($) {
    $.StringBuilder = function() {
        var _this = this;
        var _texts = [];

        this.append = function(text) {
            /// <summary>
            /// Appends a string to the end of the StringBuilder instance.
            /// </summary>
            /// <param name="text">The text to append.</param>

            _texts[_texts.length] = text;
        }
        
        this.appendFormat = function(textFormatter) {            
            throw new Exception('Not implemented.'); // working on it.
        }

        this.appendLine = function(text) {
            /// <summary>
            /// Appends a new string with a line terminator to the end of the StringBuilder instance.
            /// </summary>
            /// <param name="text">The text to append.</param>            

            _this.append(text);
            _this.append('\n');
        }

        this.clear = function() {
            /// <summary>
            /// Clears the contents of the StringBuilder instance.
            /// </summary>

            _texts = [];
        }

        this.isEmpty = function() {
            /// <summary>
            /// Determines whether the StringBuilder instance has any content.
            /// </summary>
            
            return _texts.length === 0;
        }

        this.toString = function() {
            /// <summary>
            /// Creates a string from the contents of a StringBuilder instance.
            /// </summary>

            return _texts.join('');
        }
    }
})(jQuery);