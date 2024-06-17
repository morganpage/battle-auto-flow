import "HelloWorld"

transaction(name: [String],description: [String],tier:[Int],attack:[Int],health:[Int]) {

  prepare(acct: AuthAccount) {
    log(acct.address)
  }

  execute {
    var newMinions: [HelloWorld.Minion] = []
    var i = 0 
    while i < name.length {
      newMinions.append(HelloWorld.Minion(name: name[i], description: description[i], tier: tier[i], attack: attack[i], health: health[i]))
      i = i + 1
    }
    HelloWorld.updateMinions(minions: newMinions)
  }
}
