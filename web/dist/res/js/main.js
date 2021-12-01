//--------------------GLOBAL VARIABLES---------------------\\
const d = document
const w = window

//---------------------STATIC CAROUSEL---------------------\\
// DOM Nodes Elements
const arrowLeft = d.getElementById('arrow-left')
const arrowRight = d.getElementById('arrow-right')
const items = d.getElementById('card-top__items') //cambiar nombre const

// Business Logic
const marginDisplay = {
  counter: 0,
  images: 10,
  show: 2,

  margin: function(){
    return (this.images / this.show) * 100
  },

  next: function(){
    return this.margin() / this.images
  },

  stop: function(){
    return ( this.show * this.next() ) - this.margin()
  }
}

// MediaQueryList
const mql = w.matchMedia('(max-width: 767px), (min-width: 1024px)')
mql.addEventListener('change', breakPoint)
breakPoint(mql)

function breakPoint(mql){
  resetValue()
  mql.matches
    ? marginDisplay.show = 2
    : marginDisplay.show = 5
}

w.addEventListener('resize', ()=>{
  if(innerWidth >= 1024) resetValue()
})

function resetValue(){
  marginDisplay.counter = 0
  items.removeAttribute('style')
  btnStyle()
}

// Buttom Control Direction
arrowRight.addEventListener('click', moveRight)
arrowLeft.addEventListener('click', moveLeft)

function moveRight(){
  if(marginDisplay.counter <= 0 && marginDisplay.counter > marginDisplay.stop()){
    marginDisplay.counter -= marginDisplay.next()
    items.style.marginLeft = `${marginDisplay.counter}%`
    btnStyle()
  }
}

function moveLeft(){
  if(marginDisplay.counter < 0){
    marginDisplay.counter += marginDisplay.next()
    items.style.marginLeft = `${marginDisplay.counter}%`
    btnStyle()
  }
}

// Disable Buttom Style (UX)
function btnStyle(){
  const $class = 'icon-disable'

  if(marginDisplay.counter < 0 && marginDisplay.counter > marginDisplay.stop()){
    arrowRight.classList.remove($class)
    arrowLeft.classList.remove($class)

  }else if(marginDisplay.counter === marginDisplay.stop()){
    arrowRight.classList.add($class)
    arrowLeft.classList.remove($class)

  }else{
    arrowLeft.classList.add($class)
    arrowRight.classList.remove($class)
  }
}

//---------------------BROWSER NO SUPORT---------------------\\
d.addEventListener('DOMContentLoaded', browserNoSuport)

function browserNoSuport(){
  backdropFilter()
}

function backdropFilter(){
  if(typeof d.body.style.backdropFilter === 'undefined'){
    d.documentElement.style.setProperty('--bg-transp', 'hsla(210,67%,17%,.9)')
  }
}

//-----------------------SEE SYNOPSIS-----------------------\\
const synopsis = d.getElementById('movie-synopsis')
const read = d.getElementById('movie-read')
const text = d.getElementById('read-text')

read.addEventListener('click', seeSynopsis)

function seeSynopsis(){
  if(synopsis.matches('.see-synopsis')){
    synopsis.classList.remove('see-synopsis')
    text.innerHTML = 'Mostrar más'
    
  }else{
    synopsis.classList.add('see-synopsis')
    text.innerHTML = 'Mostrar menos'
  }
}

//-----------------------NAV TABS-----------------------\\
//State of Control Online Movies Manager
const counterOnline = {
  movie: 0,
  tab: 0,
  playView: 1
}

const online = d.getElementById('online')

online.addEventListener('click', onlineManager)

function onlineManager(e){
  let obj = e.target
  let tab = obj.matches('.online__tab')
  let option = obj.matches('.online__options, .online__select, .online__select-box')
  let run = obj.matches('.icon-play, .option-item, .option-item__layer')
  
  if(tab){
    tabManager(tab, obj)
    
  }else if(option){
    viewOptions(option, false)
    
  }else if(run){
    runMovie(run, obj)
  }
}

//Tabs Manager and Views
function tabManager(tab, obj){
  tabViews(obj)
  viewPreloader(tab, false)

  if(counterOnline.tab != 0){
    viewPlay(false, false, tab)
    resetMovies()
    viewOptions(false, tab)
    layerOption(false, tab)
    crumbs(false)
  }
}

const tabItems = [... online.querySelectorAll('.online__tab')]

function tabViews(obj){
  counterOnline.tab = tabItems.indexOf(obj)
  tabActive()
  runTrailer()
}

// State of Tab Active
const videoWrap = online.querySelector('.online__video-wrap')

function tabActive(){
  let i = counterOnline.tab
  tabItems.map(item => item.classList.remove('active'))
  tabItems[i].classList.add('active')
  videoWrap.style.marginLeft = `${i * -100}%`
}

//Views Selects Options
const onlineOption = online.querySelector('.online__options')
const movieOption = online.querySelector('.online__select')

function viewOptions(toggle, remove){
  if(toggle){
    movieOption.classList.toggle('online__select--view')
    onlineOption.classList.toggle('online__options--active')
    viewPlay(false, toggle, false)
    
  }else if(remove){
    movieOption.classList.remove('online__select--view')
    onlineOption.classList.remove('online__options--active')
  }
}

//Views Play Icon
const play = online.querySelector('.icon-play')

function viewPlay(run, option, tab){
  if(run){
    play.classList.add('disable')
    counterOnline.playView = 0

  }else if(option && counterOnline.playView === 1){
    play.classList.toggle('disable')
    
  }else if(tab && counterOnline.tab === 1){
    play.classList.remove('disable')
    counterOnline.playView = 1
  }
}

// Enable or Disable trailer YouTube
const youtube = online.querySelector('#trailer')

function runTrailer(){
  if(counterOnline.tab != 1){
    youtube.removeAttribute('src')
    
  }else{
    youtube.src = youtube.dataset.src
  }
}

//Run Movie
function runMovie(run, obj){
  viewPlay(run, false, false)
  viewPreloader(false, run)
  optionActive(obj)
  crumbs(run)
  layerOption(run, false)
  viewOptions(false, run)
  resetMovies()
  initMovie()
}

//View Layer Options
const optionMovie = [... online.querySelectorAll('.option-item')]

function layerOption(remove, add){
  if(remove){
    optionMovie.map(item => item.classList.remove('option-item--layer'))

  }else if(add){
    optionMovie[counterOnline.movie].classList.add('option-item--layer')
  }
}

//Active Option Indicator
function optionActive(obj){
  if(obj.matches('.option-item')){
    counterOnline.movie = optionMovie.indexOf(obj)
    optionMovie.map(el => el.classList.remove('active'))
    optionMovie[counterOnline.movie].classList.add('active')
  }
}

// //Prepare and initialize movies
const movies = [... online.querySelectorAll('.online__movies')]

function initMovie(){
  let i = counterOnline.movie
  movies[i].style.zIndex = 1
  movies[i].src = movies[i].dataset.src
}

//Stop and Reset all Movies
function resetMovies(){
  movies.map(el => {
    el.removeAttribute('src')
    el.removeAttribute('style')
  })
}

//Preloader Logic
const preloader = [... online.querySelectorAll('.preloader')]

function viewPreloader(tab, run){
  preloader.map(item => item.classList.add('disable'))

  if(tab && counterOnline.tab === 1){
    preloader[1].classList.remove('disable')
    
  }else if(run){
    preloader[0].classList.remove('disable')
  }
}

//Bread Crumbs
const crumbsEl = online.querySelector('.online__crumbs')
let crumbsTimerID;

function crumbs(run){
  let option = optionMovie[counterOnline.movie]
  clearTimeout(crumbsTimerID)
  crumbsEl.classList.remove('disable')

  if(run){
    let quality = option.querySelector('.option-quality').innerHTML
    let lang = option.querySelector('.option-lang').innerHTML

    crumbsValue(quality, lang)
    crumbsTimer()
  }
}

function crumbsTimer(){
  crumbsTimerID = setTimeout( () => {
    crumbsEl.classList.add('disable')
  }, 20000)
}

function crumbsValue(quality, lang){
  crumbsEl.querySelector('.online__crumbs-quality').innerHTML = quality
  crumbsEl.querySelector('.online__crumbs-lang').innerHTML = lang
}