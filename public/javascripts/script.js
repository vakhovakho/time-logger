const url = new URL(window.location.href);
const error = url.searchParams.get("error");

if(error) {
    alert(error);
}
