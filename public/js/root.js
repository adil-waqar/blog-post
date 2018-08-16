let del = document.querySelector('.delete-article');

del.addEventListener('click', () => {
  fetch(`http://localhost:3000/articles/del/${del.id}`, {
    method: 'DELETE'
  })
    .then(res => res.text())
    .then(data => console.log(data));

  window.location.replace('/');
});
