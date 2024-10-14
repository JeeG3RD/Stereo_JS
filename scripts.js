// Variable contenant le fichier de sélection de fichiers audios;
const audioSelect = document.getElementById('audio_select');

// Variable contenant la div où sera créée la liste des fichiers audios;
const audioList = document.getElementById('liste_audios');

// Ajoute un écouteur d'événement sur le bouton pour détecter la sélection de fichiers;
audioSelect.addEventListener('change', onSelectionFichiers);


/**
 * Boucle sur les fichiers sélectionnés pour créer le lecteur audio avec bouton et champ de sélection gauche / droite;
 * 
 * @param {Event} event - Evenement
 */
function onSelectionFichiers(event) {
    const fichiers = event.target.files;
    // Vide la liste de fichiers;
    audioList.innerHTML = null; 

    // Boucle sur les fichiers s lectionn s
    for (let i = 0; i < fichiers.length; i++) {
        const file = fichiers[i];
        const url = URL.createObjectURL(file);

        // Cr e un lecteur audio pour chaque fichier
        createAudioPlayer(url, file.name);
    }
}

/**
 * Crée un élément audio et un AudioContext associé pour gérer la stéréo
 * 
 * @param {string} url - URL du fichier audio
 * @param {string} fileName - Nom du fichier audio
 */
function createAudioPlayer(url, fileName) {
  // Container 'global' pour chaque fichier;
  const audioContainer = document.createElement('div');
  audioContainer.classList.add('audio-container');

  const audio = new Audio(url);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  const panner = audioContext.createStereoPanner();

  // Connecte le lecteur audio au contexte
  source.connect(panner).connect(audioContext.destination);

  // Cr e des contr les pour le lecteur audio
  const playPauseButton = document.createElement('button');
  playPauseButton.textContent = 'Play';
  playPauseButton.addEventListener('click', () => {
      if (audio.paused) {
          audio.play();
          playPauseButton.textContent = 'Pause';
      } else {
          audio.pause();
          playPauseButton.textContent = 'Play';
      }
  });

  // Création de l'input range pour la sélection de la stéréo;
  const stereoControl = document.createElement('input');
  stereoControl.type = 'range';
  stereoControl.min = '-1'; // -1 => Gauche;
  stereoControl.max = '1'; // 1 => Droite;
  stereoControl.step = '0.01'; // Step de 0.01 pour une 'transition fluide' sur le champ;
  stereoControl.value = '0'; // Par défaut valeur à 0 pour centrer l'audio;
  
  // Ajout un listener sur la mise à jour du range pour mettre à jour le panner associé;
  stereoControl.addEventListener('input', () => {
      panner.pan.value = stereoControl.value;
  });

  // Créé un div pour insérer le bouton play et le range
  const controls = document.createElement('div');
  controls.classList.add('controls');
  controls.appendChild(playPauseButton);
  controls.appendChild(stereoControl);

  // Ajout du nom du fichier
  const fileLabel = document.createElement('p');
  fileLabel.textContent = fileName;

  // Ajout à la page;
  audioContainer.appendChild(fileLabel);
  audioContainer.appendChild(controls);
  audioList.appendChild(audioContainer);
}