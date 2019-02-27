import Spell from "../models/spell.js";

function formatUrl(url) {
  return '//bcw-getter.herokuapp.com/?url=' + encodeURIComponent(url)
}
let _spellApi = axios.create({
  baseURL: ''
})

let _state = {
  spellsApi: [],
  activeSpell: {},
  mySpellBook: []
}

let _subscribers = {
  spellsApi: [],
  activeSpell: [],
  mySpellBook: []
}

function setState(prop, data) {
  _state[prop] = data
  _subscribers[prop].forEach(fn => fn())
}

export default class SpellService {
  addSubscriber(prop, fn) {
    _subscribers[prop].push(fn)
  }

  get SpellsApi() {
    return _state.spellsApi.map(s => new Spell(s))
  }

  get ActiveSpell() {
    return _state.activeSpell
  }

  get MySpellBook() {
    return _state.mySpellBook.map(s => new Spell(s))
  }

  getSpellData() {
    _spellApi.get(formatUrl('http://dnd5eapi.co/api/spells/'))
      .then(res => {
        setState('spellsApi', res.data.results)
      })
  }

  getDetails(url) {
    _spellApi.get(formatUrl(url))
      .then(res => {
        let data = new Spell(res.data)
        setState('activeSpell', data)
      })
  }

  showDetails(id) {
    let spell = _state.mySpellBook.find(s => s._id == id)
    setState('activeSpell', spell)
  }

  addSpell() {
    let spell = _state.mySpellBook.find(s => s.name == _state.activeSpell.name)
    if (!spell) {
      _state.mySpellBook.push(_state.activeSpell)
      _subscribers.mySpellBook.forEach(fn => fn())
    }
  }
}
