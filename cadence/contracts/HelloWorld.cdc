pub contract HelloWorld {

  pub struct Minion{
    pub var name: String
    pub var description: String
    pub var tier: Int
    pub var attack: Int
    pub var health: Int

    init(name: String, description: String, tier: Int, attack: Int, health: Int) {
      self.name = name
      self.description = description
      self.tier = tier
      self.attack = attack
      self.health = health
    }
  }

  pub var greeting: String
  pub var minions: [Minion]

  pub fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  pub fun updateMinions(minions:[Minion]) {
    self.minions = minions
  }

  init() {
    self.greeting = "Hello, World!"
    self.minions = [
      Minion(name: "Murloc", description: "A murloc", tier: 1, attack: 1, health: 1),
      Minion(name: "Dragon", description: "A dragon", tier: 2, attack: 2, health: 2),
      Minion(name: "Demon", description: "A demon", tier: 3, attack: 3, health: 3)
    ]
  }
}
