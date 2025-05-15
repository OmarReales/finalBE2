export default class UserDTO {
  constructor(user) {
    // Manejar tanto documentos de Mongoose como payload de JWT
    this.id = user._id || user.id;

    // Si viene de JWT puede no tener first_name y last_name
    if (user.first_name && user.last_name) {
      this.full_name = `${user.first_name} ${user.last_name}`;
    }

    this.email = user.email;
    this.role = user.role;

    // Solo incluir el carrito si existe
    if (user.cart) {
      this.cart = user.cart;
    }
  }
}
