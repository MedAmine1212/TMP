// LowerCase Letters
var lowerCaseLetters = /[a-z]/g;

// Capital letters
var upperCaseLetters = /[A-Z]/g;

// Numbers
var numbers = /[0-9]/g;

// Phone Format
var phone = /[0-9]{3}-[0-9]{3}-[0-9]{4}/g;

// Symbols
var symbols = /[!~<>°%;.§@#$%^&*]/g;

/** --------------- Functions -------------------------- */

function Alert(Class) {
  $("."+Class).show();

  $("."+Class).siblings().hide();
}



function ValidateSize(file) {
  var FileSize = file.files[0].size / 1024 / 1024; // in MB
  var FileExt = file.files[0].type;

  var allowedExt = ["image/jpeg", "image/png"];
  var isAllowed = allowedExt.includes(FileExt);

  if (isAllowed) {
    if (FileSize <= 2) {
      Alert("valid-photo");
    } else {
      Alert("size-error");
    }
  } else {
    Alert("ext-error");
  }
}

/** --------------- Valiate Strong Password --------------- */

$.validator.addMethod(
  "strongPassword",
  function(value, element) {
    return (
      this.optional(element) ||
      (value.match(lowerCaseLetters) &&
        value.match(numbers) &&
        value.match(upperCaseLetters)) && value.match(symbols)
    );
  },
  "<span data-i18n='messages.strong-password' class='i18_links'> </span>"
);

/** -------------- Validate Phone Number ---------------*/

$.validator.addMethod(
  "phoneNumber",
  function(value, element) {
    return (
      this.optional(element) ||
      (value.match(phone) &&
        !(value.match(lowerCaseLetters) && !value.match(upperCaseLetters)))
    );
  },
  "<span data-i18n='messages.phone' class='i18_links'> </span>"
);

/** ------------ Validate E-Mail ------------------*/

$.validator.addMethod(
  "validEmail",
  function(value, element) {
    AltIndex = value.indexOf("@");
    pointIndex = value.indexOf(".", AltIndex);

    var local = value.slice(0, AltIndex);
    var domain = value.slice(AltIndex + 1, pointIndex);
    var ext = value.slice(pointIndex + 1, value.length);

    return (
      this.optional(element) ||
      (ext.length > 1 &&
        domain.length > 0 &&
        local.length > 0 &&
        !ext.match(/[|\\/~^:,;?!&%$@*+]/))
    );
  },
  "<span data-i18n='messages.email' class='i18_links'> </span>"
);

/** ------------ Equal To Value -------------- */

$.validator.addMethod(
  "rightAnswer",
  function(value, element, answer) {

    return (
      this.optional(element) ||
      value == answer
    );
  },
  "Réponse Incorrecte"
);

/** ----------- Registrar Format ------------ */
$.validator.addMethod(
  "registrarFormat",
  function(value, element, name_input ) {
    format = $('select[name="registrar"] option').filter(":selected").attr("data-format");

    flag = true;
    if (format.length == value.length) {

      for (let index = 0; index < format.length; index++) {
        numberArray = ['1','2','3','4','5','6','7','8','9'];
        if (numberArray.includes(format.charAt(index))) {

          flag = numberArray.includes(value.charAt(index));

        } else {

          if (format.charAt(index) != value.charAt(index)) {
            return false;
          }
        }

      }
    } else {
      flag = false;
    }


    return (
      this.optional(element) || flag
    );
  },
  "Format de numéro d'entreprise invalide"
);

/** ------------ File Size --------------- */
$.validator.addMethod(
  "FileSize",
  function(value, element, param) {
    return this.optional(element) || element.files[0].size <= param;
  },
  "<span data-i18n='messages.file.size_2m' class='i18_links'> </span>"
);
/**------------- File Extension ----------- */
function Extension(filename) {
  return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

function isValidImage(filename) {
  var allowedExtensions = ['jpeg','jpg','png'];
  return (allowedExtensions.indexOf(Extension(filename))!=-1)
}

$.validator.addMethod(
  "Extension",
  function(value, element, param) {
    return this.optional(element) || isValidImage(element.files[0].name);
  },
  "<span data-i18n='messages.file.ext_jpg_png' class='i18_links'> </span>"
);

/** Nombre Input Régles */
$.validator.addMethod(
    "num",
    function(value, element) {
      return (
        this.optional(element) ||
        (value.match(numbers) &&
          !(value.match(lowerCaseLetters) && !value.match(upperCaseLetters)))
      );
    },
    "<span data-i18n='messages.number' class='i18_links'> </span>"
  );

