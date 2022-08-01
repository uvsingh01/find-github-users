const APIURL = 'https://api.github.com/users/'
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

        getUser(user)

        search.value = ''
})
async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)

        createUserCard(data)
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No profile with this username')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch(err) {
        createErrorCard('Problem fetching repos')
    }
}

function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <p>&nbspFollowers&nbsp</p></li>
        <li>${user.following} <p>&nbspFollowing&nbsp</p></li>
        <li>${user.public_repos} <p>&nbspRepos&nbsp</p></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `
    main.innerHTML = cardHTML
    
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposlist = document.getElementById('repos')

    repos
        // .slice(0, 3)
        .forEach(repo => {
            const repolist = document.createElement('a')
            repolist.classList.add('repo')
            repolist.href = repo.html_url
            repolist.target = '_blank'
            repolist.innerText = repo.name
            reposlist.appendChild(repolist)
        })
}



