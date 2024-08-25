//API GITHUB
export class  GithubUser {
  static search(username){
    
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(data => ({
      login: data.login,
      name: data.name,
      public_repos: data.public_repos,
      followers: data.followers,
    }))
  }
}

//TRATAMENTO DADOS
export class Favorites {
  constructor(root) {
      this.root = document.querySelector(root);
      this.load();
  }
  
  load() {
    const entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    console.log(entries)
    //const entries = []

    this.entries = entries;
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExist = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase());

      if (userExist) {
        throw new Error("Usuário já existente");        
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");        
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } 
    catch (error) {
      alert(error.message)
    }
  }

  delete(users) {
    const filteredEntries = this.entries.filter(entry => 
      (entry.login !== users.login))
      this.entries = filteredEntries;
      this.update();
      this.save();
  }
}


//VISUALIZADOR
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    const tbody = this.root.querySelector('table tbody');
    this.tbody = tbody;

    this.onadd();
    this.update();
  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value)
    }
  }

  createRow() {
    const content = 
    `<td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>maykbrito</span>
        </a>
        </td>
        <td class="repositories">
        76
        </td>
        <td class="followers">
        9589
        </td>
        <td>
        <button class="remove">&times;</button>
        </td>`;

        const tr = document.createElement('tr');
        tr.innerHTML = content;

        return tr
  }

  update() {
      this.removeAll();

      this.entries.forEach(users => {
        const row = this.createRow();
        row.querySelector('.user img').src = `https://github.com/${users.login}.png`;
        row.querySelector('.user a').href = `https://github.com/${users.login}`;
        row.querySelector('.user p').textContent = `${users.name}`;
        row.querySelector('.user span').textContent = `https://github.com/${users.login}`;
        row.querySelector('.repositories').textContent = `${users.public_repos}`;
        row.querySelector('.followers').textContent = `${users.followers}`;
        row.querySelector('.remove').onclick = () => {
          const isOk = confirm('Deseja deletar esse favorito?');
          if (isOk) {
            this.delete(users);
          }
          
        }
        this.tbody.append(row)
      })
  }

  removeAll() {
      
      this.tbody.querySelectorAll('tr').forEach((tr) => {
          tr.remove();
      });
  }
}