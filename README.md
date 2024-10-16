# MultiSelect
JavaScript multi select library

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/darainfo/daracl.multiselect/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/@daracl%2Fmultiselect.svg)](https://badge.fury.io/js/@daracl%2Fmultiselect)
[![npm](https://img.shields.io/npm/d18m/%40daracl%2Fmultiselect)](https://github.com/darainfo/daracl.multiselect/releases)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@daracl%2Fmultiselect)](https://bundlephobia.com/package/@daracl%2Fmultiselect)


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)  
--- | --- | --- | --- | --- |  
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |  


<p>
<img src="https://github.com/darainfo/daracl.multiselect/blob/main/demo.gif?raw=true"/>
</p>


1. Install

```sh
yarn install
# OR
npm install
```

2. Run

```sh
npm start
```

3. Open `http://localhost:8890` in your browser

# 다국어 처리 
```
  Daracl.multiSelect.setMessage({
    up: '위',
    down: '아래',
    add: '추가',
    allAdd: '전체추가',
    remove: '제거',
    allRemove: '전체제거',
    maxSizeMsg: "{maxSize} 개 까지 등록 가능합니다.", // 추가 가능한 max size가 넘었을경우 메시지 String
    duplicate: "이미 등록된 항목이 존재합니다.",
    addEmptyMessage: "추가할 항목을 선택해주세요.",
    removeEmptyMessage: "제거할 항목을 선택해주세요.",
  })
```

# 사용방법
```
const example1 = Daracl.multiSelect.create('#example1', {
    mode: 'double'	// single, double
    , style: {
      height: 300
    }
    , orientation: 'horizontal' // horizontal , vertical
    , body: {
      enableMoveBtn: true	// 이동 버튼 보이기 여부
      , moveBtnSize: 50	// item move button 영역 width 값
    }
    , footer: {
      enable: true
    }
    , useMultiSelect: true
    , useDragMove: true	// drag해서 이동할지 여부.
    , useDragSort: true // target drag 해서 정렬할지 여부.
    , enableUpDown: true // updown 버튼 활성화여부.

    , duplicateCheck: true
    , valueKey: 'viewid'
    , labelKey: 'uname'
    , source: {
      items: []
      , enableLabel: true
      , search: {
        enable: true
        , callback: (param) => {
          console.log(param)
        }
      }
      , completeMove: function (addItems) {
        console.log('source completeMove fn', JSON.stringify(addItems));
        return true;
      }
      , paging: {
        enable: true
        , unitPage: 10
        , totalCount: 300
        , currPage: 15
        , callback: function (clickInfo) {
          console.log(clickInfo)
        }
      }
    }
    , target: {
      label: 'Target'
      , enableLabel: true
      , items: []
      , limitSize: -1 // 추가 가능한 max size
      , emptyMessage: 'asdfasdf '
      , completeMove: function (delItem) {
        console.log(delItem);
      }
      , paging: {
        enable: true
        , unitPage: 10
        , totalCount: 150
        , currPage: 1

        , callback: function (clickInfo) {
          console.log(clickInfo)
        }
      }
    }

  });
```
  
<style>
  table td, table th{
    border: 1px solid #dddd;
    vertical-align:top;
  }
  </style>

# 옵션
<table>
   <thead>
      <tr>
         <th></th>
         <th>설명</th>
         <th>기본값</th>
         <th>옵션</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>style</td>
         <td> </td>
         <td>
            <table>
               <thead>
                  <tr>
                     <th></th>
                     <th>설명</th>
                     <th>기본값</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>width</td>
                     <td> 넓이 </td>
                     <td>"auto"</td>
                  </tr>
                  <tr>
                     <td>height</td>
                     <td>높이 </td>
                     <td>300</td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td></td>
      </tr>
      <tr>
         <td>mode</td>
         <td>mode </td>
         <td>double</td>
         <td>single, double</td>
      </tr>
      <tr>
         <td>orientation</td>
         <td> 방향</td>
         <td>horizontal</td>
         <td>horizontal, vertical</td>
      </tr>
      <tr>
         <td>body</td>
         <td> </td>
         <td>
            <table>
               <thead>
                  <tr>
                     <th></th>
                     <th>설명</th>
                     <th>기본값</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>enableMoveBtn</td>
                     <td> 이동버튼 보이기 여부 </td>
                     <td>true</td>
                  </tr>
                  <tr>
                     <td>moveBtnSize</td>
                     <td> 버튼 width </td>
                     <td>50</td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td></td>
      </tr>
      <tr>
         <td>enableAddEmptyMessage</td>
         <td> 추가 아이템 없을때 메시지 보이기 여부 </td>
         <td>false</td>
         <td></td>
      </tr>
      <tr>
         <td>enableRemoveEmptyMessage</td>
         <td> 삭제 아이템 없을때 메시지 보이기 여부 </td>
         <td>false</td>
         <td></td>
      </tr>
      <tr>
         <td>useMultiSelect</td>
         <td> 다중 항목 추가 여부 사용여부 </td>
         <td>true</td>
         <td></td>
      </tr>
      <tr>
         <td>useDragMove</td>
         <td> Drag 이동여부 </td>
         <td>false</td>
         <td></td>
      </tr>
      <tr>
         <td>useDragSort</td>
         <td> drag 상하위 이동 가능여부 </td>
         <td>false</td>
         <td></td>
      </tr>
      <tr>
         <td>addPosition</td>
         <td> 추가 위치  </td>
         <td>bottom</td>
         <td>bottom, top</td>
      </tr>
      <tr>
         <td>duplicateCheck</td>
         <td> 중복체크 </td>
         <td>true</td>
         <td></td>
      </tr>
      <tr>
         <td>enableUpDown</td>
         <td> 상하위 이동 버튼 활성화 여부 </td>
         <td>false</td>
         <td></td>
      </tr>
      <tr>
         <td>valueKey</td>
         <td>item value key  </td>
         <td>code</td>
         <td></td>
      </tr>
      <tr>
         <td>labelKey</td>
         <td>item label key </td>
         <td>name</td>
         <td></td>
      </tr>
      <tr>
         <td>pageNumKey</td>
         <td> page number key </td>
         <td>pageNo</td>
         <td></td>
      </tr>
      <tr>
         <td>source</td>
         <td> </td>
         <td>
            <table>
               <thead>
                  <tr>
                     <th></th>
                     <th>설명</th>
                     <th>기본값</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>label</td>
                     <td> label name </td>
                     <td></td>
                  </tr>
                  <tr>
                     <td>labelAlign</td>
                     <td> label 정렬 </td>
                     <td>center<br> ex:) left, center, right </td>
                  </tr>
                  <tr>
                     <td>enableLabel</td>
                     <td>label 활성화 여부</td>
                     <td>false</td>
                  </tr>
                  <tr>
                     <td>enableAddBtn</td>
                     <td> 추가 버튼 보이기 여부 </td>
                     <td>true</td>
                  </tr>
                  <tr>
                     <td>emptyMessage</td>
                     <td> 항목 없을때 메시지 </td>
                     <td>""</td>
                  </tr>
                  <tr>
                     <td>items</td>
                     <td> 항목 </td>
                     <td>[]</td>
                  </tr>
                  <tr>
                     <td>search</td>
                     <td> </td>
                     <td>
                        <table>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>설명</th>
                                 <th>기본값</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>enable</td>
                                 <td> 검색 활성화 여부 </td>
                                 <td>false</td>
                              </tr>
                               <tr>
                                 <td>callback</td>
                                 <td>검색 콜백 </td>
                                 <td></td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td>paging</td>
                     <td> </td>
                     <td>
                        <table>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>설명</th>
                                 <th>기본값</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>enable</td>
                                 <td> 페이지 활성화 여부 </td>
                                 <td>false</td>
                              </tr>
                              <tr>
                                 <td>unitPage</td>
                                 <td>페이지 몇개 보일지 여부 </td>
                                 <td>10</td>
                              </tr>
                              <tr>
                                 <td>currPage</td>
                                 <td>현재 페이지 정보 </td>
                                 <td>1</td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td></td>
      </tr>
      <tr>
         <td>target</td>
         <td> </td>
         <td>
            <table>
               <thead>
                  <tr>
                     <th></th>
                     <th>설명</th>
                     <th>기본값</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>label</td>
                     <td> label name </td>
                     <td></td>
                  </tr>
                  <tr>
                     <td>labelAlign</td>
                     <td> label 정렬 </td>
                     <td>"center"</td>
                  </tr>
                  <tr>
                     <td>enableLabel</td>
                     <td> label 활성화 여부 </td>
                     <td>false</td>
                  </tr>
                  <tr>
                     <td>enableRemoveBtn</td>
                     <td> 삭제 버튼 보이기 여부 </td>
                     <td>true</td>
                  </tr>
                  <tr>
                     <td>emptyMessage</td>
                     <td>항목 없을때 메시지 </td>
                     <td></td>
                  </tr>
                  <tr>
                     <td>items</td>
                     <td>항목 </td>
                     <td>[]</td>
                  </tr>
                  <tr>
                     <td>limitSize</td>
                     <td> 제한갯수 </td>
                     <td>-1</td>
                  </tr>
                  <tr>
                     <td>search</td>
                     <td> </td>
                     <td>
                        <table>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>설명</th>
                                 <th>기본값</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>enable</td>
                                 <td> 검색 활성화 여부  </td>
                                 <td>false</td>
                              </tr>
                              <tr>
                                 <td>callback</td>
                                 <td>검색 콜백 </td>
                                 <td></td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td>paging</td>
                     <td> </td>
                     <td>
                        <table>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>설명</th>
                                 <th>기본값</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>enable</td>
                                 <td> 페이지 활성화 여부 </td>
                                 <td>false</td>
                              </tr>
                              <tr>
                                 <td>unitPage</td>
                                 <td> 페이지 몇개 보일지 여부 </td>
                                 <td>10</td>
                              </tr>
                              <tr>
                                 <td>currPage</td>
                                 <td> 현재 페이지 정보 </td>
                                 <td>1</td>
                              </tr>
                              <tr>
                                 <td>enableMultiple</td>
                                 <td> </td>
                                 <td>true</td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
         <td></td>
      </tr>
   </tbody>
</table>


## License
Darainfo is under [MIT License](./LICENSE).