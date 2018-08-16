let del = document.querySelector('.delete-article');
if (del) {
  del.addEventListener('click', () => {
    fetch(`http://localhost:3000/articles/del/${del.id}`, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(data => console.log(data));
  });
}
