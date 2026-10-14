// Vuelve a mostrar el mensaje de consentimiento del CMP de Google (AdSense →
// Privacidad y mensajes). https://support.google.com/adsense/answer/10959060
(function () {
  var btn = document.querySelector('[data-privacy-settings]');
  if (!btn) return;
  btn.addEventListener('click', function () {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(function () {
      if (window.googlefc.showRevocationMessage) window.googlefc.showRevocationMessage();
    });
  });
})();
