self.addEventListener('install', function(event) {

  console.log('xxx install', event);

  const speaker = new SpeechSynthesisUtterance();
  speaker.lang = 'RU-ru';
  speaker.rate = 1;
  speaker.text = 'Test message';

  window.speechSynthesis.speak(speaker);

  setTimeout(() => {
    const speaker = new SpeechSynthesisUtterance();
    speaker.lang = 'RU-ru';
    speaker.rate = 1;
    speaker.text = 'Test message 1000';

    window.speechSynthesis.speak(speaker);
  }, 1000);

  setTimeout(() => {
    const speaker = new SpeechSynthesisUtterance();
    speaker.lang = 'RU-ru';
    speaker.rate = 1;
    speaker.text = 'Test message 5000';

    window.speechSynthesis.speak(speaker);
  }, 5000);
});
