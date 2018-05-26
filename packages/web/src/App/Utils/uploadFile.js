export default function uploadFile(event, componentThis, onload){
  event.preventDefault()
  let files
  if (event.dataTransfer) {
    files = event.dataTransfer.files;
  } else if (event.target) {
    files = event.target.files;
  }
  const reader = new FileReader();
  const file = files[0]
  reader.onload = () => {
    file.uri = reader.result
    onload(file)
  }
  reader.readAsDataURL(file);
}
