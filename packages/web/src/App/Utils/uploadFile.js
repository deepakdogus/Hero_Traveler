export default function uploadFile(event, componentThis, onload){
  event.preventDefault()
  let files
  if (event.dataTransfer) {
    files = event.dataTransfer.files;
  } else if (event.target) {
    files = event.target.files;
  }
  const reader = new FileReader();
  reader.onload = () => {
    onload(reader.result)
  }
  reader.readAsDataURL(files[0]);
}
