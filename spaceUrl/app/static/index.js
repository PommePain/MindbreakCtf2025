async function uploadFileByUrl() {
  try {
    const url = document.getElementById('urlInput').value;
    const fileType = document.getElementById('fileTypeSelect').value;
    const response = await fetch("/upload-file-url", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, file_type: fileType }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      document.getElementById('addFileByUrl').classList.add('hidden');
      window.location.reload();
    } else {
      alert("Une erreur est survenue lors de l'ajout du fichier");
    }
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de l'ajout du fichier");
  }
  document.getElementById('addFileByUrl').classList.add('hidden');
}

async function deleteAllFiles() {
  try {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer tous les fichiers qui ont été upload ?");

    if (confirmation) {
      const response = await fetch("/uploaded-files", { method: 'DELETE' });

      const data = await response.json();
      if (response.ok && data.success) {
        window.location.reload();
      } else {
        alert(data.error);
      }
    }
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de la suppression des fichiers");
  }
}

async function deleteFile(fileId) {
  try {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce fichier?');
    if (confirmation) {
      const response = await fetch(`/file/${fileId}`, { method: 'DELETE' });

      const data = await response.json();
      if (response.ok && data.success) {
        window.location = '/';
      } else {
        alert("Une erreur est survenue lors de la suppression du fichier");
      }
    }
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de la suppression du fichier");
  }
}