import React, { Component } from 'react'
import { Welcome } from '../welcome/Welcome'
import { Cart } from '../cart/Cart'
import { ALLUSERS } from '../constants'
// import {CARTITEMS }from '../constants'
import { CommerceService } from '../../lib/services'
const comService = new CommerceService()
export class StoreHome extends Component {
  state = {
    displayPage: 'Cart', 
    currentUserIndex: 0,
    error: {},
    allUsers: ALLUSERS, 
    hasExpressShipping: false,
    hasPromo: false,
    payment: {},
    shipping: {},
    // cartItems: CARTITEMS,  
    cartItems: {},  

    data: [],
    loading: false, 
    errorBool: false, //error in the api stuff, refacktor 
  }

  async componentDidMount() {
    this.setState({loading: true})
    comService.fetchProducts()
      .then((res) => {
        if (res && res.response.ok) {

          const transformedItems = {}
          res.data.forEach((item) => {
            transformedItems[item.name] = item
          })



          this.setState({
            data: res.data, 
            loading: false, 
            cartItems: transformedItems,
          })
        } else {
          this.setState({ loading: false})
        }
    }, (error) => {
      console.log(error)
      this.setState({
        loading: false, 
        errorBool: true,
      })
    })
  }
  //below is safe
  // async componentDidMount() {
  //   this.setState({loading: true})
  //   comService.fetchProducts()
  //     .then((res) => {
  //       if (res && res.response.ok) {
  //         this.setState({
  //           data: res.data, 
  //           loading: false, 
  //           // cartItems: res.data,
  //         })
  //       } else {
  //         this.setState({ loading: false})
  //       }
  //   }, (error) => {
  //     console.log(error)
  //     this.setState({
  //       loading: false, 
  //       errorBool: true,
  //     })
  //   })
  // }


  changeState = (name, state, func) => {
    this.setState({
      [name]: state,
    }, func)
  }

  changeSubState = (parent, name, subName, subState) => {
    this.setState((prev) => ({
      [parent]: {
        ...prev[parent],
        [name]: {
          ...prev[parent][name],
          [subName]: subState,
        },
      },
    }));
  }

  calculateTotal = () => {
    const { cartItems, hasPromo, hasExpressShipping } = this.state;
    let total = 0;  
    let discount = hasPromo ? 100 : 0
    let fee = hasExpressShipping ? 300 : 0
    let subTotal = 0;  
    Object.values(cartItems).forEach((item) => {
      subTotal += item.price * item.quantity;
    })
    total = subTotal - discount + fee
    this.setState({ subTotal, total, discount, fee })
  }

  changeCartQuantity = (name, subName, subState) => {
    this.setState(prevState => {
      const updatedCartItems = { ...prevState.cartItems }
      updatedCartItems[name][subName] = subState
      return { cartItems: updatedCartItems }
    }, this.calculateTotal)
  }

  changePromo = (state) =>    this.changeState('hasPromo', state, this.calculateTotal)

  changeExpressSpeed = (state) => this.changeState('hasExpressShipping', state, this.calculateTotal)   

  changeDisplayPage = (state) => this.changeState('displayPage', state) 
  changeCurrentuserIndex = (state) => this.changeState('currentUserIndex', state)
  addUser = (user) =>  {
    this.setState((prevState) => ({
      allUsers: [...prevState.allUsers, user]
    }))
  }
  addShipping = (state) => this.changeState('shipping', state)
  addPayment = (state, func) => this.changeState('payment', state, func)
  
  render() {
    const { displayPage, data } = this.state
    const { name, description, price, image } = data
    console.log(data);
    return (
      <div className="storeWrapper">
        <h1> Bestus Online Marketplace</h1>
        <div className="components">
          { displayPage === 'Welcome' && 
            <Welcome 
            mainState={this.state}
            changeDisplayPage={this.changeDisplayPage}
            changeCurrentuserIndex={this.changeCurrentuserIndex}
            addUser={this.addUser}            
            />}
            { displayPage ==='Cart' &&
              <Cart 
              mainState={this.state}
              changeDisplayPage={this.changeDisplayPage}
              changeCartQuantity={this.changeCartQuantity}
              changePromo={this.changePromo}
              addShipping={this.addShipping}
              changeExpressSpeed={this.changeExpressSpeed}
              addPayment={this.addPayment}
              />
            }
        </div>
      </div>
    )
  }
}
export default StoreHome
