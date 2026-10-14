// Solicita un anuncio de AdSense por cada bloque manual presente en la página.
// Solo se carga si PUBLIC_ADSENSE_CLIENT y algún bloque están configurados.
(function () {
  var units = document.querySelectorAll('ins.adsbygoogle:not([data-ac-requested])');
  for (var i = 0; i < units.length; i++) {
    units[i].setAttribute('data-ac-requested', '');
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
})();
