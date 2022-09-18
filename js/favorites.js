import { GithubUser } from "./GithubUser.js";

// Classe que contem a lógica e estruturação dos dados

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(userName) {
    try {
      const userExist = this.entries.find((entry) => entry.login === userName);
      if (userExist) {
        return alert(`${userName} is already on your list`);
      }
      const user = await GithubUser.search(userName);

      if (user.login === undefined) {
        throw new Error("Usuário não existe");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (e) {
      alert(e);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (eachEntry) => eachEntry.login !== user.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}
// ==================================

// Classe que vai criar a vizualização e eventos do HTML
export class FavoritesView extends Favorite {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  update() {
    this.removeAllRows();

    this.entries.forEach((eachUser) => {
      const row = this.addRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${eachUser.login}.png`;
      row.querySelector(".user p").textContent = eachUser.name;
      row.querySelector(".user span").textContent = eachUser.login;
      row.querySelector("td.repos").textContent = eachUser.public_repos;
      row.querySelector("td.followers").textContent = eachUser.followers;
      row.querySelector("td a").href = `https://github.com/${eachUser.login}`;

      row.querySelector(".remove").onclick = () => {
        const confirmRemoval = confirm("Tem certeza que deseja deletar?");
        if (confirmRemoval) {
          this.delete(eachUser);
        }
      };

      this.tbody.append(row);
    });
  }

  addRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="user">
      <img src="" alt="" />
      <a href="" target="_blank"
        ><p></p>
        <span></span>
      </a>
    </td>
    <td class="repos"></td>
    <td class="followers"></td>
    <td><button class="remove">&times;</button></td>
    `;

    return tr;
  }

  removeAllRows() {
    const trs = this.tbody.querySelectorAll("tr");
    trs.forEach((eachTr) => {
      eachTr.remove();
    });
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");

    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }
}

// ==============================
