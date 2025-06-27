import Phaser from 'phaser';

export class BugChaseGame extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  obstacles!: Phaser.Physics.Arcade.Group;
  score: number = 0;
  scoreText!: Phaser.GameObjects.Text;
  gameOver: boolean = false;
  lastObstacleX: number = 0;

  constructor() {
    super('BugChaseScene');
  }

  preload() {
    this.load.image('player', 'bug-chase/player.png');
    this.load.image('ground', 'bug-chase/ground.png');
    this.load.image('bug', 'bug-chase/bug.png');
  }

  create() {
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground').setScale(2).refreshBody();

    this.player = this.physics.add.sprite(100, 450, 'player')
      .setScale(0.07, 0.12); // Compact runner
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.player.body && this.player.body.blocked.down) {
        this.player.setVelocityY(-400);
      }
    });

    this.obstacles = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
    }).setScrollFactor(0);

    this.physics.add.collider(this.player, this.obstacles, () => {
      if (!this.gameOver) {
        console.log("💥 COLLISION!");
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.player.setVelocityX(0);
        this.physics.pause();
      }
    }, undefined, this);

    this.spawnObstacle(800);
    this.lastObstacleX = 800;
  }

  override update(): void {
    if (this.gameOver) {
      this.player.setVelocityX(0);
      return;
    }

    this.player.setVelocityX(160);
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    if (this.player.x + 400 > this.lastObstacleX) {
      this.lastObstacleX += 400;
      this.spawnObstacle(this.lastObstacleX);
    }

    this.obstacles.getChildren().forEach((obstacle: Phaser.GameObjects.GameObject) => {
      const obs = obstacle as Phaser.Physics.Arcade.Sprite;
      if (obs.x + obs.width < 0) {
        obs.destroy();
      }
    });
  }

  spawnObstacle(x: number) {
    
    const gap = 240;
    const bugHeight = 40;
    const extraOffset = 30;

    const midY = 430;
    const bottomY = midY + gap / 2;
    const topY = midY - gap / 2 - bugHeight - extraOffset;

    const bottomBug = this.obstacles.create(x, bottomY, 'bug')
      .setScale(0.09)
      .setImmovable(true) as Phaser.Physics.Arcade.Image;

    const topBug = this.obstacles.create(x + 150, topY, 'bug')
      .setScale(0.09)
      .setImmovable(true) as Phaser.Physics.Arcade.Image;

    [bottomBug, topBug].forEach(bug => {
      if (bug.body && bug.body instanceof Phaser.Physics.Arcade.Body) {
        bug.body.allowGravity = false;
        bug.setVelocityX(-280); // ✅ აჩქარებული ბაგები
      }
    });
  }
}

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 600 },
      debug: false
    }
  },
  scene: BugChaseGame,
  parent: 'game-container',
  backgroundColor: '#0f172a'
};
