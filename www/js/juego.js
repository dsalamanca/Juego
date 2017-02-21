var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
	timer1 = 0;
	timer10 = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
	  game.load.image('objetivo10', 'assets/objetivo10.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
	  
	  /*al dibujar la bola despues del texto la bola pasa por encima del texto*/
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
	  objetivo10 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo10');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
	  
	  game.time.events.loop(Phaser.Timer.SECOND, app.updateCounter, this);
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
	  game.physics.arcade.enable(objetivo10);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
	  game.physics.arcade.overlap(bola, objetivo10, app.incrementaPuntuacion10, null, this);
	  
	  if(bola.body.checkWorldBounds()===false){
		game.stage.backgroundColor='#f27d0c';
	  }else{
		game.stage.backgroundColor='#ff3300';
	  }
	  
	  if (dificultad <15){
		tiempo1=19-dificultad;
	  }
	  if (dificultad <8){
		tiempo10=9-dificultad;
	  }
		  if ( timer1 == tiempo1 ){
			timer1=0;
			objetivo.body.x = app.inicioX();
			objetivo.body.y = app.inicioY();
		  }
		
		  if ( timer10 == tiempo10 ){
			timer10=0;
			objetivo10.body.x = app.inicioX();
			objetivo10.body.y = app.inicioY();
		  }
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  updateCounter: function(){
    timer1++;
	timer10++;
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
	document.body.className = 'agitado';
  },

  incrementaPuntuacion: function(){
	puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },
  
   incrementaPuntuacion10: function(){
	puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

	objetivo10.body.x = app.inicioX();
    objetivo10.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
		app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = Math.abs(datosAceleracion.x) > 10;
    var agitacionY = Math.abs(datosAceleracion.y) > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}