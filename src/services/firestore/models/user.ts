export class User {
	name: any
	state: any
	country: any

	constructor(data) {
		this.name = data.name
		this.state = data.state
		this.country = data.country
	}
	toString() {
		return this.name + ', ' + this.state + ', ' + this.country
	}
}
