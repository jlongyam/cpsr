class CPSR {
  constructor( name = 'cpsr' ) {
    this.name = name
    if( type( sessionStorage.getObject( this.name ) ) === 'null' ) {
      sessionStorage.setObject( this.name, {
        session: Date.now(),
        recent: '',
        data: []
        })
      }
    }
  _listen( file, callback ) {
    file.addEventListener( 'change', ( event )=> {
      const files = event.target.files[0]
      if( files ) callback( files )
      })
    }
  file_info = { name: '', type: '', size: '', lastModified: '' }
  file_mime = { primary: '', secondary: '' }
  file_value = ''
  file_content = ''
  storage_exists = false
  get storage_path() {
    let result = []
    const obj = sessionStorage.getObject( this.name )
    const a_data = Object.keys( obj.data )
    for( var i = 0; i < a_data.length; i++ ) {
      result.push( obj.data[a_data[i]].path )
      }
    return result
    }
  get storage_recent() {
    const obj = sessionStorage.getObject( this.name )
    if( obj.recent.length === 0 ) return ''
    else return obj.recent
    }
  capture( file, callback ) {
    this._listen( file, ( files )=> {
      this.file_info.name = files.name
      this.file_info.type = files.type
      this.file_info.size = bytes_to( files.size )
      this.file_info.lastModified = files.lastModified
      const reader = new FileReader()
      const a_files = files.type.split('/')
      this.file_mime.primary = a_files[0]
      this.file_mime.secondary = a_files[1]
      if( this.file_mime.primary === 'text' ) {
        reader.readAsText( files )
        reader.addEventListener( 'loadend', ( event )=> {
          this.file_value = event.target.result
          callback()
          })
        }
      })
    }
  capturePreview( iframe ) {
    if( this.file_mime.secondary === 'html' ) this.file_content = this.file_value
    else this.file_content = '<pre>' + this.file_value + '</pre>'
    let content = iframe.contentDocument || iframe.contentWindow.document
    content.open()
    content.write( this.file_content );
    content.close()
    }
  save() {
    const data = {
      path: this.file_info.name,
      content: {
        type: this.file_info.type,
        size: this.file_info.size,
        value: this.file_value
        }
      }
    let obj = sessionStorage.getObject( this.name )
    obj.session = Date.now()
    obj.recent = this.file_info.name
    let exist = false
    let a_data = Object.keys( obj.data )
    for( var i = 0; i < a_data.length; i++ ) {
      let path = obj.data[a_data[i]].path
      if( path === this.file_info.name ) {
        exist = true
        this.storage_exists = true
        }
      }
    if( !exist ) {
      obj.data.push( data )
      sessionStorage.setObject( this.name, obj  )
      } 
    }
  retrieve( path ) {
    if( type(path) === 'undefined' )  path = this.storage_recent
    if( path.length != 0 ) {
      const obj = sessionStorage.getObject( this.name )
      let value = ''
      const a_data = Object.keys( obj.data )
      for( var i = 0; i < a_data.length; i++ ) {
        let o_path = obj.data[a_data[i]].path
        if( o_path === path ) value = obj.data[a_data[i]].content
        }
      return value
      }
    }
  retrievePreview( iframe, data ) {
    const mime = data.type.split('/'), mime_primary = mime[0], mime_secondary = mime[1]
    let content = iframe.contentDocument || iframe.contentWindow.document
    let value = ''
    if( mime_primary === 'text' ) {
      if( mime_secondary === 'html' ) value = data.value
      else value = '<pre>' + data.value + '</pre>'
      }
    content.open()
    content.write( value );
    content.close()
    }
  }