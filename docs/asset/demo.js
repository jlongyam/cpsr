file1.addEventListener( 'change', ( event )=> {
  var files = event.target.files[0]
  if( files ) {

    // Pre-CAPTURE
    var infos = {
      name: files.name,
      type: files.type,
      size: files.size,
      lastModified: files.lastModified
    }

    report1.innerHTML = JSON.stringify( infos, 0, 2 )

    // READ
    var reader = new FileReader()

    // VALUE 
    var type = {
      primary: files.type.split('/')[0],
      secondary: files.type.split('/')[1]
    }
   
    report1_value.textContent = JSON.stringify( type,0,2 )
    
    if( type.primary === 'text' ) {      
      reader.addEventListener( 'loadend', ()=> {
        
        // CAPTURE
        // VALUE 
        ta_value.removeAttribute( 'hidden' )
        ta_value.value = reader.result

        // PREVIEW
        iframe_preview.removeAttribute( 'hidden' )
        var o_url = URL.createObjectURL(files);
        iframe_preview.src = o_url
        iframe_preview.onload = ()=> URL.revokeObjectURL(o_url)

        // SAVE

        sessionStorage.setItem( 'last-item', files.name )
        btn_save.removeAttribute( 'hidden' )
        btn_save.addEventListener( 'click' ,()=> {
          var obj = {
              type: files.type,
              size: files.size,
              value: reader.result
          }
          sessionStorage.setObject( files.name, obj  )
          report1_save.innerHTML = 'store: "' + files.name + '"'
        })
      })
      reader.readAsText(files)
    }
    if( type.primary === 'image' ) {
      if( type.secondary === 'svg+xml' ) {
        reader.addEventListener( 'loadend', ()=> {
          // VALUE 
          ta_value.removeAttribute( 'hidden' )
          ta_value.value = reader.result

          // PREVIEW
          iframe_preview.removeAttribute( 'hidden' )
          var o_url = URL.createObjectURL( files );
          iframe_preview.src = o_url
          iframe_preview.onload = ()=> URL.revokeObjectURL(o_url)

        })
        reader.readAsText(files)
      }
      else {

      }
    }
  }
})
btn_load.addEventListener( 'click', ()=> {
  var last_item = ''
  if( type( sessionStorage.getItem('last-item') ) === 'null' ) last_item = last_item
  else last_item = sessionStorage.getItem('last-item')

  if( last_item.length === 0 ) {
    report1_load.textContent = "last_item.length === 0"
  }
  else {
    var val = sessionStorage.getObject( last_item )
    if( type(val) != 'null' ) {
      ta_load.removeAttribute( 'hidden' )
      iframe_load.removeAttribute( 'hidden')
      ta_load.value = val.value
      var o_blob = new Blob( [val.value], { type: val.type, size: val.size })
      var o_url = URL.createObjectURL(o_blob);
      iframe_load.src = o_url
      iframe_load.onload = ()=> URL.revokeObjectURL(o_url);
      report1_load.innerHTML = 'name: ' + last_item + '\ntype: ' + val.type + '\nsize: ' + val.size
    }
  }
  btn_storage.removeAttribute( 'hidden')
  btn_storage.addEventListener('click', ()=> {
    pre_storage.textContent = JSON.stringify( sessionStorage,0,2 )
  })
})

btn_clear.addEventListener('click',()=> {
  sessionStorage.clear()
  pre_storage.textContent = JSON.stringify( sessionStorage,0,2 )
})
