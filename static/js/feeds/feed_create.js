console.log("hey")




function displayLocalFile (strFileName) {
    var url = 'file:/media/' + strFileName;
    if (document.layers && location.protocol.toLowerCase() != 'file:' && navigator.javaEnabled())
      netscape.security.PrivilegeManager.enablePrivilege('UniversalFileRead');
    open (url, 'preview');
  }