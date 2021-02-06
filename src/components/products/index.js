/* globals */
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import swal from 'sweetalert'
/* import moment from 'moment'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) */

const handlerOnAddDocEventListener = function (eventObj) {
  const { error, /* document, foundation, */ data } = eventObj
  if (error) {
    console.error(`Error adding user: ${error}`)
    return
  }
  console.debug([data, ...this.state.products])
  this.setState({ products: [data, ...this.state.products] })
}

const handlerOnEditDocEventListener = function (eventObj) {
  const { data, primaryKey, /* document, foundation, */ error } = eventObj
  if (error) {
    console.error(`Error updating user: ${error}`)
    return
  }
  const newData = this.state.products.map((product) => {
    if (product.__id === primaryKey) {
      return data
    } else {
      return product
    }
  })
  console.debug([...newData])
  this.setState({ products: [...newData] })
}

const handlerOnDeleteDocEventListener = function (eventObj) {
  const { error, /* document, foundation, */ data } = eventObj
  if (error) {
    console.error(`Error deleting user: ${error}`)
    return
  }
  const allProducts = [...this.state.products]
  for (let x = 0; x < allProducts.length; x++) {
    const product = allProducts[x]
    if (product.__id === data.__id) {
      allProducts.splice(x)
    }
  }
  this.setState({ products: allProducts })
}

/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component Products
 * @description React component consuming a Product Data Entity collection to feed a grid
 * @extends React.Component
 */
class Products extends React.Component {
  constructor (props) {
    super(props)
    // console.error('------>', props)
    /**
     * Entity name which this component represents to
     */
    this.entity = 'Product'
    /**
     * access to foundation instance
     */
    this.foundation = props.foundation
    /**
     * default pagination to list data
     */
    this.pagination = {
      offset: 0,
      limit: 30
    }
    /**
     * component state
     */
    this.state = {
      products: []
    }
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
  }

  /**
   * @Method Products.componentWillUnmount
   * @summary Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in componentDidMount.
   * @description lets stop listen to Product Data State Change Events
   * @example
componentWillUnmount() {
  const { Product } = this.foundation.data
  Product.stopListenTo(this.onAddDocEventListener)
  Product.stopListenTo(this.onEditDocEventListener)
  Product.stopListenTo(this.onDeleteDocEventListener)
}
   */
  componentWillUnmount () {
    const { Product } = this.foundation.data
    /**
     * Destroy event listeners of this component which are listening to Product collection
     * and react to it
     */
    Product.stopListenTo(this.onAddDocEventListener)
    Product.stopListenTo(this.onEditDocEventListener)
    Product.stopListenTo(this.onDeleteDocEventListener)
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
  }

  /**
   * @async
   * @Method Products.componentDidMount
   * @summary Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @description Once component is monted we are now ready to start listen to changes on Product data entity and get a list of product in database to fill out the state.products
   * @example
componentDidMount() {
  const { Product } = this.foundation.data

  this.onAddDocEventListener = Product.on(
    'add',
    handlerOnAddDocEventListener.bind(this)
  )

  this.onEditDocEventListener = Product.on(
    'edit',
    handlerOnEditDocEventListener.bind(this)
  )

  this.onDeleteDocEventListener = Product.on(
    'delete',
    handlerOnDeleteDocEventListener.bind(this)
  )

  const { error, data } = await Product.find({}, { ...this.pagination })
  if (!error) {
    this.setState({ products: products.data })
  }
}
   */
  async componentDidMount () {
    const { Product } = this.foundation.data

    // listen to add, edit and delete events on Product collection
    // and react to it
    /**
     * listen to add Product Data Entity change event on Data API
     */
    this.onAddDocEventListener = Product.on('add', handlerOnAddDocEventListener.bind(this))

    /**
     * listen to edit Product Data Entity change event on Data API
     */
    this.onEditDocEventListener = Product.on('edit', handlerOnEditDocEventListener.bind(this))

    /**
     * listen to delete Product Data Entity change event on Data API
     */
    this.onDeleteDocEventListener = Product.on('delete', handlerOnDeleteDocEventListener.bind(this))

    // get Products on database
    const products = await Product.find({}, { ...this.pagination })
    // console.warn(products)

    if (products.data) {
      this.setState({ products: products.data })
    }
  }

  /**
   * @Method Products.handleDeleteProduct
   * @summary Event handler that Deletes a product
   * @description Once component is monted we are now ready to start listen to changes on Product data entity and get a list of product in database to fill out the state.products
   * @param  {event} event - The HTML event triggered on User interation
   * @param  {number} __id - The primaryKey value of the record willing to be deleted
   * @example
handleDeleteProduct(e, ___id) {
  const { Product } = this.foundation.data
  e.preventDefault()
  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this!',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then(async (willDelete) => {
    if (willDelete) {
      const r = await Product.delete(___id)
      if (r.error) {
        swal('Database error', e.error.message, 'error')
        return
      }
      swal('Poof! The product has been deleted!', {
        icon: 'success'
      })
      return <Redirect to = '/dashboard' / >
    } else {
      swal('The Product is safe!')
    }
  })
}

// <a color='primary' href='#' onClick={e => this.handleDeleteProduct(e, doc.__id)}>[delete]</a>
   */
  handleDeleteProduct (e, ___id) {
    const { Product } = this.foundation.data
    e.preventDefault()
    // console.error(___id)
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const r = await Product.delete(___id)
        // console.error(r)
        if (r.error) {
          swal('Database error', e.error.message, 'error')
          return
        }
        swal('Poof! The product has been deleted!', {
          icon: 'success'
        })
        return <Redirect to='/dashboard' />
      } else {
        swal('The Product is safe!')
      }
    })
  }

  /**
   * @async
   * @Method Products.render
   * @summary Component render function.
   * @description Renders a grid of Products
   */
  render () {
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bproduct-bottom'>
          <h1 className='h2'>Products</h1>
          <div className='btn-toolbar mb-2 mb-md-0'>
            <div className='btn-group me-2'>
              <LinkContainer to='/ProductsAdd'>
                <button type='button' className='btn btn-sm btn-outline-secondary'>
                  Add new Product
                </button>
              </LinkContainer>
            </div>
          </div>
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-sm'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>E-mail</th>
                <th align='right'>Cards</th>
                <th>-</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.address}</td>
                  <td>{doc.email}</td>
                  <td align='right'>{doc.cards}</td>
                  <td>
                    <Link color='primary' to={`/ProductsEdit/${doc.__id}`}>[edit]</Link>
                    | <a color='primary' href='#' onClick={e => this.handleDeleteProduct(e, doc.__id)}>[delete]</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

    )
  }
}

export default Products
