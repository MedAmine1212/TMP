try {
    var lang = member.language.toLowerCase();
} catch (error) {
    lang = "en";
}

if ( lang == undefined || lang == null || lang == "" || lang == "undefined" ) {
  lang = "en";
}

$.i18n.init(
  {
    resGetPath: "/locales/__lng__.json",
    load: "unspecific",
    fallbackLng: false,
    lng: lang,
  },
  function(t) {
    $(".i18_links").i18n();
    $(".nav-btn-translate").removeClass("btn-primary text-white");
    $(".nav-btn-"+lang.toLowerCase()).addClass("btn-primary text-white");
  }
);

/**
 *
 */

function nav_translate_to_language(language_abbr) {
    language_abbr = language_abbr.toLowerCase();
    i18n.setLng(language_abbr, function(err, t) {

        $(".i18_links").i18n();
        $(".nav-btn-translate").removeClass("btn-primary text-white");
        $(".nav-btn-"+language_abbr).addClass("btn-primary text-white");
      });
}


function updateLanguage(language_abbr) {
    $.ajax({
        type: "PUT",
        url: api_gateway_url + '/members-service/api/member/update/' + member.id,
        data: {
            language: language_abbr.toLowerCase()
        },
        success: function (data) {
            createCookie("language", language_abbr.toLowerCase());
            nav_translate_to_language(language_abbr);

        },
        error: function (res, status, error) {
            window.alert("Erreur changement language");
        },
    });
}

function i18next_update() {
  switch (lang) {
    case "en":
      translate_en();

      break;
    case "fr":
      translate_fr();

      break;
  }
}

/** Translate Specific Element */


function translate_element(element, language) {
  i18n.setLng(language, function(err, t) {
    $(element).i18n();

  });
}

/** English */

function translate_en() {
  i18n.setLng("en", function(err, t) {

    $(".i18_links").i18n();

    $(".btn-translate.active").removeClass("active");
    $(".set_en").addClass("active");
  });
}

/** Français */

function translate_fr() {
  i18n.setLng("fr", function(err, t) {

    $(".i18_links").i18n();

    $(".btn-translate.active").removeClass("active");
    $(".set_fr").addClass("active");
  });
}

$(".set_fr").on("click", function() {
  translate_fr();
});

$(".set_en").on("click", function() {
    translate_en();
  });

