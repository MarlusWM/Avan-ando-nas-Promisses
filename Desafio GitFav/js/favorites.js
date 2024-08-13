//TRATAMENTO DADOS

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')
        
    }

    load(){
        const entries = [
            {
            login: 'marluswm',
            name:'Marlus Weber',
            public_repos:'87',
            followers:'12'
            },
            {
            login: 'LeandroWeberMidginski',
            name:'Leandro Weber',
            public_repos:'82',
            followers:'11'
            }
        ]

        this.entries = entries
    }

    delete(user){
        const filteredEntries = this.entries.filter((entry) => 
        entry.login !== user.login)
    }
}


//VISUALIZADOR

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)

        console.log(this.root)
    }

    update(){
        this.removeAll()

        this.entries.forEach((user) => {
            const row = this.createRow();
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user a').href = `https://github.com/${user.login}`;
            row.querySelector('.user img').alt = `Foto de ${user.name}`;
            row.querySelector('.user p').innerText = `${user.name}`;
            row.querySelector('.user span').innerText = `${user.login}`;
            row.querySelector('.repositories').innerText = `${user.public_repos}`;
            row.querySelector('.followers').innerText = `${user.followers}`;

            this.tbody.append(row)

            //row.querySelector('.remove').onclick = () => { verificar se está respondendo
                const isOk = confirm('Tem certeza que deseja deletar?')
                if (isOk) {
                    this.delete(user)
                }
            }
        })
    }

    createRow(){
        const tr = document.createElement('tr')

        const content = ` 
        <td class="user">
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
        </td>
        `

        tr.innerHTML = content
    }

    removeAll(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }
}