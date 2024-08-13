
class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then((data)=> {
            return {
                login: data.login,
                name: data.name,
                public_repos: data.public_repos,
                followers: data.followers
            }
        })
    }
}

//classe que vai conter a lógica dos dados
//como os dados serão estruturados
export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)        
        this.load()
        this.tbody = this.root.querySelector('table tbody')
        this.onadd()
    }

    load(){
        const entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        console.log(entries)
        /*const entries = [
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
        ]*/

        this.entries = entries
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    
    async add(username){
        try {
            const userExists = this.entries.find(entry => entry.login)
            if (userExists) {
                throw new Error("Usuário já cadastrado")                
            }

            const user = await GithubUser.search(username)
            console.log(user)
            if (user.login === undefined) {
                throw new Error(`Usuário não encontrato`)                
            }

            this.entries = [user, ...this.entries]
            this.update()

        } catch (error) {
            alert(error)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter((entry) => entry.login !== user.login)
        console.log(filteredEntries)

        this.entries = filteredEntries
        this.update()
        this.save()
    }

}


//classe que vai criar a visualização e eventos html
export class FavoritesView extends Favorites {
    constructor(root){
        super(root)//esse root se refere a classe pai (Favorites)
    
        console.log(this.root)
        this.removeAllTr()
        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }


    update() {
        this.removeAllTr()
        this.entries.forEach((user)=> {
            const row = this.createRow()           
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').innerText = `${user.name}`
            row.querySelector('.user span').innerText = `${user.login}`
            row.querySelector('.repositories').innerText = `${user.public_repos}`
            row.querySelector('.followers').innerText = `${user.followers}`

            this.tbody.append(row)

            row.querySelector('.remove').onclick = ()=> {
                const isOk = confirm('Tem certeza que deseja deletar esta linha?')
                if(isOk){
                    this.delete(user)
                }
            }
        })
    }


    createRow(){
        const tr= document.createElement('tr')

        const content =  ` 
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
        
        return tr
    }


    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr)=> {tr.remove()})
    }
}

    