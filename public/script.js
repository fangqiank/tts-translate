const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('#textInput');
const languageSelect = document.querySelector('#languageSelect');

const language = [
	{ code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
	{ code: 'ja', name: 'Japanese' },
	{ code: 'zh-CN', name: 'Chinese (simplified)' }
]

language.forEach(lang => {
	const option = document.createElement('option');
	option.value = lang.code
	option.textContent = lang.name;
	languageSelect.appendChild(option);
});

let voices = []
const loadVoices = () => {
	voices = speechSynthesis.getVoices()
	voiceSelect.innerHTML = voices
		.map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`).join('')
}

speechSynthesis.onvoiceschanged = loadVoices
loadVoices()

const translateText = async (text, language) => {
	try{
		const res = await fetch(`/api/translate`, {
			method: 'POST',
			body: JSON.stringify({
				text,
				target: language
			}),
			headers: { 'Content-Type': 'application/json' }
		})

		if(!res.ok)
			throw new Error(`Error ${response.status}: ${await response.text()}`)

		const data = await res.json()
		return data.translations[0].translatedText
	}catch(err){
		console.error('Translation Error: ', error);
    alert('Failed to translate text');
		return text	
	}
}

const playText = (index, txt) => {
	const utteance = new SpeechSynthesisUtterance(txt)
	if(voices[index]) 
		utteance.voice = voices[index]
	speechSynthesis.speak(utteance)
}

playButton.addEventListener('click', async () => {
	const text = textInput.value.trim()
	const targetLang = languageSelect.value
	const selectedVoiceInd = voiceSelect.value

	if(!text){
		alert('Please enter a text to play')
		return
	}
	
	try{
		const translatedText = await translateText(text, targetLang)
		playText(translatedText, selectedVoiceInd)
	}catch(err){
		console.error('Error during processing: ', err);
    alert('An error occurred');
	}
})