""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" File description                                                             "
"                                                                              "
" @file spec.vim                                                               "
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Print an error message
" @function Error
" @param {String} message Error message
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
fu! Error(message)
  let str=a:message " Inline comment