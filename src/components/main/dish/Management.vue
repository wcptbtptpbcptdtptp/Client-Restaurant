<template>
  <div class="mainContanier">
    <Menu class="menu"/>
    <div class="right">
      <TopLine class="top"/>
      <div class="firstPart">
        <div class="chooseDish">
          <Icon class="icon" type="ios-search-strong" size="23" color="#FCC138"></Icon>
          <Input class="input" placeholder="搜索当前分类菜品名称" clearable size="small" v-model="search" @on-keydown="searchDishes"/>
        </div>
        <div class="goodsState">
          <span>商品状态</span>
          <CheckboxGroup v-model="filter" class="checkboxGroup" @on-change="onFilterChange">
            <Checkbox class="checkBox" label="售卖中"><span>售卖中</span></Checkbox>
            <Checkbox class="checkBox" label="已售罄"><span>已售罄</span></Checkbox>
          </CheckboxGroup>
        </div>
        <div class="newGruop">
          <Button type="ghost" class="newGroupBtn" @click="gotoNewCate">新建分类</Button>
          <Button type="info" class="newGroupBtn" @click="gotoAddDish">新建菜品</Button>
        </div>
      </div>
      <div class="content">
        <div class="category">
          <div class="title">
            <span>菜品分类</span>
            <Icon type="gear-b" size="16" @click.native="editCategory" :class="{activeGear: isEditCate === true}"></Icon>
          </div>
          <div v-for="(item, index) in myCategories" :key="index" v-dragging="{ item: item, list: myCategories, group: 'category' }">
            <div class="menuItem" @click="goto(index)" :class="{subActive: activeSubIndex === index}">
              <div class="menuItemEdit">
                <Icon class="iconMiddle" type="ios-minus-outline" color="#ff8b18" size="18" v-show="isEditCate === true" @click.native="delCate(myCategories[index].id)"></Icon>
                <input class="menuIteminput" disabled="true" :class="{textActive: activeSubIndex === index}" :value="myCategories[index].name" @blur="changeCate(index)"/>
              </div>
              <span class="moveTips" v-show="isEditCate === false">按住拖动</span>
            </div>
          </div>
          <div class="menuItem" v-show="isEditCate === true & isAddNow === false" @click="newCateInput">
            <div class="menuItemEdit">
              <Icon class="iconMiddle" type="ios-plus-outline" color="#ff8b18" size="18"></Icon>
              <span class="menuIteminput">添加分类…</span>
            </div>
            <div></div>
          </div>
          <div v-show="isAddNow === true">
            <input type="text" placeholder="新分类名" class="addCateInput" v-model="newCateName">
            <Icon type="checkmark" color="#fe8966" size="15" class="checkmark" @click.native="addNewCate"></Icon>
          </div>
        </div>
        <div class="secondPart">
          <div class="detailPart">
            <div class="curCategory">
              <div class="curCategoryLeft">
                <span contenteditable="false" id="curCateName" :class="{isCurEdit: isCurEdit === true}">{{curCategory.name}}</span>
                <Icon type="edit" size="16" @click.native="editCurCate(curCategory.id)" :class="{isCurEditIcon: isCurEdit === true}"></Icon>
              </div>
              <!-- <div class="curCategoryRight" @click="toggleQuickEdit" :class="{quickEdit: isQuickEdit === true}">快速编辑</div> -->
              <div class="curCategoryRight" @click="toggleQuickEdit">{{quickEditHint}}</div>
            </div>
            <div class="dishes" v-show="!isQuickEdit">
              <div class="dish" v-for="(dish, index) in filterDishes" :key="index" @click="gotoEditDish(dish)">
                <div class="tagLine">
                  <div class="leftTag">
                    <div class="rectangle"></div>
                    <div class="No">{{index+1}}</div>
                  </div>
                  <div class="rightTag">
                    <div class="tag" :class="{tagBlue: dish.state === '售卖中', tagGrey: dish.state === '已售罄'}">
                      <div class="circle"></div><span>{{dish.state}}</span>
                    </div>
                    <div @click.stop="deleteDish(dish.dish_id)">
                      <img class="deleteBtn" src="@/assets/images/delete-button.png" alt="deleteBtn">
                    </div>
                  </div>
                </div>
                <div class="dishBody">
                  <div class="bodyLeft"><img class="dishImg" :src="dish.image_url"/></div>
                  <div class="bodyRight">
                    <div class="dishNameLine">
                      <span class="dishName">{{dish.name}}</span>
                      <div>
                        <img src="@/assets/images/chilli.svg" alt="chilli" class="chilli" v-if="dish.spicy > 2">
                        <img src="@/assets/images/chilli.svg" alt="chilli" class="chilli" v-if="dish.spicy > 1">
                        <img src="@/assets/images/chilli.svg" alt="chilli" class="chilli" v-if="dish.spicy > 0">
                      </div>
                    </div>
                    <div class="brief">{{dish.description}}</div>
                    <div class="tagList">
                      <span v-for="(tag, index) in dish.tag" :key="index" :class="{tag1: index % 4 === 0, tag2: index % 4 === 1, tag3: index % 4 === 2, tag4: index % 4 === 3}">{{tag}}</span>
                    </div>
                    <div class="price"><span>¥{{dish.price}}</span>起</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="isQuickEdit" class="quickEdit">
              <div class="quickEditTitle">
                <div>当前状态</div>
                <div>名称</div>
                <div>图片</div>
                <div>基础价格</div>
                <div>操作</div>
              </div>
              <div class="titleLine"></div>
              <div class="quickEditItem" v-for="(dish, index) in filterDishes" :key="dish.dish_id">
                <div>
                  <div class="tag" :class="{tagBlue: dish.state === '售卖中', tagGrey: dish.state === '已售罄'}" @click="toggleState(index, dish)">
                    <div class="circle"></div><span>{{dish.state}}</span>
                  </div>
                </div>
                <div><input class="quickEditName" type="text" maxlength="15" :value="dish.name" @blur="changeAttr(index,'name',dish)" @change="setDirty(index)"></div>
                <!-- <div class="imgCol"><img :src="dish.image_url" class="imgs"/><input type="file" class="uploadFile"></div> -->
                <div class="imgCol"><img :src="dish.image_url" class="imgs"/></div>
                <div><input class="quickEditPrice" type="number" :value="dish.price" @blur="changeAttr(index,'price',dish)" @change="setDirty(index)"></div>
                <div><span @click.stop="deleteDish(dish.dish_id)">删除</span></div>
              </div>
            </div>
            <div class="bottomHint">
              <div class="shortLine"></div>
              <p>已到达本分类底部</p>
              <!-- <p>继续滑动前往下一分类</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from './../Menu';
import TopLine from './../TopLine';
export default {
  data () {
    return {
      activeSubIndex: 0,
      filter: ['售卖中', '已售罄'],
      isEditCate: false,
      isAddNow: false,
      isCurEdit: false,
      newCateName: '',
      isQuickEdit: false,
      quickEditHint: '快速编辑',
      filterDishes: [],
      model1: '',
      toCateId: -1,
      myCategories: [],
      idArr: [],
      search: ''
    };
  },
  computed: {
    categories () {
      return this.$store.state.categories;
    },
    curCategory () {
      if (this.myCategories.length) {
        return this.myCategories[this.activeSubIndex];
      } else {
        return {
          name: '',
          id: -1
        };
      }
    },
    dishes: {
      get: function () {
        if (this.$store.state.dishList[this.activeSubIndex]) {
          return this.$store.state.dishList[this.activeSubIndex].dish;
        }
      },
      set: function () {
      }
    }
  },
  watch: {
    dishes: function (newValue, oldValue) {
      if (this.filter.length === 2) {
        this.filterDishes = this.dishes;
      } else if (this.filter.length === 0) {
        this.filterDishes = [];
      } else {
        this.filterDishes = this.dishes.filter(dish => dish.state === this.filter[0]);
      }
    },
    categories: function (newValue, oldValue) {
      this.myCategories = [];
      for (let i = 0, len = this.$store.state.dishList.length; i < len; ++i) {
        this.myCategories.push({
          id: this.$store.state.dishList[i].category_id,
          name: this.$store.state.dishList[i].name
        });
      }
    }
  },
  beforeMount () {
    this.$store.commit('UPDATE_INDEX', 2);

    for (let i = 0, len = this.$store.state.dishList.length; i < len; ++i) {
      this.myCategories.push({
        id: this.$store.state.dishList[i].category_id,
        name: this.$store.state.dishList[i].name
      });
    }
  },
  mounted () {
    for (let i = 0; i < this.$store.state.categories.length; ++i) {
      if (this.$store.state.curCateName === this.$store.state.categories[i].name) {
        this.activeSubIndex = i;
        break;
      }
    }
    this.filterDishes = this.dishes;
    this.$dragging.$on('dragged', ({ value }) => {
    });
    this.$dragging.$on('dragend', (value) => {
      this.idArr = [];
      for (let i = 0, len = this.myCategories.length; i < len; ++i) {
        this.idArr.push(this.myCategories[i].id);
      }
      this.$store.dispatch('reOrderCate', this.idArr).then((err) => {
        if (err) {
          this.errorMsg = err;
        } else {
          this.$store.dispatch('getDish').then((err) => {
            if (err) {
              this.errorMsg = err;
            } else {
              this.$router.push('/main/dish/management');
            }
          });
        }
      });
    });

    // var self = this.$store;
    // var uploadFiles = document.getElementsByClassName('uploadFile');
    // console.log(uploadFiles);
    // for (let i = 0; i < uploadFiles.length; ++i) {
    //   let j = i;
    //   console.log(j);
    //   uploadFiles[j].onchange = function (j) {
    //     var imgFile = this.files[0];
    //     console.log(imgFile);
    //     self.dispatch('uploadImg', this.files[0]).then((err) => {
    //       if (err) {
    //       } else {
    //         var fr = new FileReader();
    //         fr.onload = function () {
    //           document.getElementsByClassName('imgs')[j].src = fr.result;
    //         };
    //         fr.readAsDataURL(imgFile);
    //       }
    //     });
    //   };
    // }
  },
  methods: {
    goto (index) {
      // console.log(index);
      this.activeSubIndex = index;
      this.$store.commit('SAVE_CUR_CATENAME', this.curCategory.name);
    },
    searchDishes () {
      if (event.keyCode === 13) {
        this.filterDishes = this.dishes.filter(dish => dish.name.indexOf(this.search) !== -1);
      }
    },
    editCategory () {
      let menuItem = document.getElementsByClassName('menuIteminput');
      if (this.isEditCate) {
        this.isEditCate = false;
        this.isAddNow = false;
        for (let i = 0; i < menuItem.length; ++i) {
          menuItem[i].disabled = true;
        }
      } else {
        this.isEditCate = true;
        for (let i = 0; i < menuItem.length; ++i) {
          menuItem[i].disabled = false;
        }
      }
    },
    newCateInput () {
      this.isAddNow = true;
    },
    addNewCate () {
      this.isAddNow = false;
      if (this.newCateName !== '') {
        this.$store.dispatch('addCate', this.newCateName).then((err) => {
          if (err) {
            this.errorMsg = err;
          } else {
            this.newCateName = '';
            this.$store.dispatch('getDish').then((err) => {
              if (err) {
                this.errorMsg = err;
              } else {
                this.$router.push('/main/dish/management');
              }
            });
          }
        });
      }
    },
    gotoNewCate () {
      this.isAddNow = true;
      this.isEditCate = true;
    },
    delCate (id) {
      this.$Modal.confirm({
        // 使用render动态生成界面元素
        render: (h) => {
          return h('Select', {
            props: {
              value: this.model1,
              placeholder: '请选择该分类下所有菜品的新分类'
            },
            // 监听器设置
            on: {
              'on-change': (val) => {
                // console.log(val);
                this.model1 = val;
              }
            }
          }, [this.myCategories.filter(item => item.id !== id).map(function (item) {
            // 嵌套render..
            return h('Option', {
              props: {
                value: item.name,
                key: item.name
              }
            });
          }), h('Option', {
            props: {
              value: '直接删除所有菜品'
            }
          })]
          );
        },
        onOk: () => {
          this.toCateId = -1;
          for (let i = 0; i < this.myCategories.length; ++i) {
            if (this.myCategories[i].name === this.model1) {
              this.toCateId = this.myCategories[i].id;
              break;
            }
          }
          this.$store.dispatch('delCate', {
            oldId: id,
            toId: this.toCateId
          }).then((err) => {
            if (err) {
              this.errorMsg = err;
            } else {
              this.$store.dispatch('getDish').then((err) => {
                if (err) {
                  this.errorMsg = err;
                } else {
                  this.$router.push('/main/dish/management');
                }
              });
            }
          });
          this.model1 = '';
        },
        onCancel: () => {
          this.model1 = '';
        }
      });
    },
    changeCate (index) {
      let newName = document.getElementsByClassName('menuIteminput')[index].value;
      // console.log(newName);
      this.$store.dispatch('changeCate', {
        name: newName,
        id: this.myCategories[index].id
      }).then((err) => {
        if (err) {
          this.errorMsg = err;
        } else {
          this.$store.dispatch('getDish').then((err) => {
            if (err) {
              this.errorMsg = err;
            } else {
              this.$router.push('/main/dish/management');
            }
          });
        }
      });
    },
    editCurCate (id) {
      if (this.isCurEdit) {
        document.getElementById('curCateName').contentEditable = false;
        let newName = document.getElementById('curCateName').innerText;
        // console.log(newName);
        this.$store.dispatch('changeCate', {
          name: newName,
          id: id
        }).then((err) => {
          if (err) {
            this.errorMsg = err;
          } else {
          }
        });
      } else {
        document.getElementById('curCateName').contentEditable = true;
      }
      this.isCurEdit = !this.isCurEdit;
    },
    gotoAddDish () {
      this.$store.commit('SET_ISEDITDISH', false);
      this.$store.commit('SAVE_NEWDISH_IMG', '');
      this.$store.commit('UPDATE_CUR_DISH', {
        flag: 0
      });
      this.$router.push('/main/dish/newdish');
    },
    gotoEditDish (data) {
      this.$store.commit('SET_ISEDITDISH', true);
      this.$store.commit('SAVE_NEWDISH_IMG', data.image_url[0]);
      this.$store.commit('SAVE_CUR_CATENAME', this.curCategory.name);
      data.flag = 1;
      data.category = this.curCategory.name;
      // console.log('gotoEditDish', data);
      this.$store.commit('UPDATE_CUR_DISH', data);
      this.$router.push('/main/dish/newdish');
    },
    deleteDish (id) {
      this.$Modal.confirm({
        title: '删除菜品提示',
        content: '确认删除该菜品?',
        onOk: () => {
          this.$store.dispatch('delDish', id).then((err) => {
            if (err) {
            } else {
              this.$store.dispatch('getDish').then((err) => {
                if (err) {
                  this.errorMsg = err;
                } else {
                  this.$router.push('/main/dish/management');
                }
              });
            }
          });
        }
      });
    },
    updateList () {
      if (this.isQuickEdit) {
        for (let i = 0, len = this.dishes.length; i < len; ++i) {
          if (this.dishes[i].dirty) {
            if (this.dishes[i].state === '售卖中') {
              this.$store.commit('UPDATE_DISH_INFO', {
                activeIndex: this.activeSubIndex,
                index: i,
                key: 'selling',
                newValue: true
              });
            } else {
              this.$store.commit('UPDATE_DISH_INFO', {
                activeIndex: this.activeSubIndex,
                index: i,
                key: 'selling',
                newValue: false
              });
            }
            this.$store.dispatch('modifyDish', {
              id: this.dishes[i].dish_id,
              data: {
                selling: this.dishes[i].selling,
                name: this.dishes[i].name,
                price: this.dishes[i].price
              }
            });
          }
        }
      }
    },
    toggleQuickEdit () {
      this.updateList();
      this.isQuickEdit = !this.isQuickEdit;
      if (this.quickEditHint === '快速编辑') {
        this.quickEditHint = '回到普通编辑';
      } else {
        this.quickEditHint = '快速编辑';
      }
    },
    toggleState (index, dish) {
      if (dish.state === '售卖中') {
        this.$store.commit('UPDATE_DISH_INFO', {
          activeIndex: this.activeSubIndex,
          key: 'state',
          newValue: '已售罄',
          dish: dish
        });
      } else {
        this.$store.commit('UPDATE_DISH_INFO', {
          activeIndex: this.activeSubIndex,
          key: 'state',
          newValue: '售卖中',
          dish: dish
        });
      }
      // console.log('toggleState');
      this.filterDishes[index].dirty = 1;
    },
    setDirty (index) {
      this.filterDishes[index].dirty = 1;
    },
    changeAttr (index, key, dish) {
      let newValue;
      if (key === 'name') {
        newValue = document.getElementsByClassName('quickEditName')[index].value;
      } else {
        newValue = Number(document.getElementsByClassName('quickEditPrice')[index].value);
      }
      this.$store.commit('UPDATE_DISH_INFO', {
        activeIndex: this.activeSubIndex,
        key: key,
        newValue: newValue,
        dish: dish
      });
    },
    onFilterChange () {
      this.updateList();
      if (this.filter.length === 2) {
        this.filterDishes = this.dishes;
      } else if (this.filter.length === 0) {
        this.filterDishes = [];
      } else {
        this.filterDishes = this.dishes.filter(dish => dish.state === this.filter[0]);
      }
    }
  },
  components: {
    Menu,
    TopLine
  }
};
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  z-index: 9999;
}
.mainContanier {
  display: flex;
  min-height: 100vh;

  .right {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    width: 100%;

    .top {
      position: fixed;
      right: 0;
      z-index: 9998;
      padding-left: 168px;
    }

    .firstPart {
      background-color: #ffffff;
      margin-bottom: 13px;
      height: 58px;
      border-radius:4px;
      display: flex;
      justify-content: space-between;
      width: 85.5%;
      position: fixed;
      top: 102px;
      left: 189px;
      z-index: 10;

      .chooseDish {
        display: flex;
        margin: 14px 0 0px 3px;

        .icon {
          position: relative;
          left: 30px;
          z-index: 10;
          padding-top: 5px;
        }
        .input {
          width: 281px;
        }
      }

      .goodsState {
        margin-top: 20px;
        font-size: 14px;
        letter-spacing:1.12px;
        text-align:left;
        font-family:PingFangSC-Regular;
        color:#493f3a;
        flex: 1;
        padding-left: 100px;

        .checkboxGroup {
          display: inline-block;
          .checkBox {
            font-family:PingFangSC-Regular;
            font-size:14px;
            letter-spacing:1.12px;

            span {
              padding-left: 8px;
            }
          }
          .checkBox:nth-child(1) {
            padding-left: 34px;
          }
          .checkBox:nth-child(2) {
            padding-left: 20px;
          }
        }
      }

      .newGruop {
        margin: 17px 26px;

        .newGroupBtn {
          width: 86px;
          height: 26px;
          line-height: 1;
          margin-left: 20px;
        }
      }
    }

    .content {
      display: flex;
      flex: 10;
      flex-direction: column;
      background-color:#f6f6f6;
      padding: 22px 22px 0 22px;
      position: fixed;
      left: 168px;
      width: 100%;
      height: 100%;

      .category::-webkit-scrollbar {
        display: none;
      }

      .category {
        background-color: #ffffff;
        border-radius:6px 0 0 0;
        width:177px;
        height:80%;
        box-shadow:0 2px 15px 0 rgba(193,193,193,0.42);
        z-index: 10;
        font-size:14px;
        // position: fixed;
        margin-top: 158px;
        overflow: auto;

        .activeGear {
          color: #ff8b18;
        }

        .title {
          font-family:PingFangSC-Medium;
          letter-spacing:1.12px;
          text-align:left;
          padding: 18px 0 14px 20px;

          span {
            padding-right: 56px;
          }
        }

        .menuItem {
          width:167px;
          height:52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: auto;
          cursor: default;
          text-align: left;

          .menuItemEdit {
            margin-left: 15px;
          }

          .menuIteminput {
            outline: none;
            border: none;
            width: 80px;
            margin-left: 5px;
            background: transparent;
          }

          // span:nth-child(1) {
          //   margin-left: 15px;
          // }
          .moveTips {
            right: 2px;
            font-size: 12px;
            margin-right: 11px;
            color: #ff8b18;
            opacity: 0;
          }

          .textActive {
            color: #ff8b18;
          }
        }

        .addCateInput {
          width: 138px;
          margin: auto;
          border:1px solid #ffc993;
          border-radius:4px;
          height:29px;
          padding: 2px 20px 2px 6px;
          outline: none;
          display: block;
          margin-top: 10px;
        }

        .checkmark {
          position: relative;
          right: -56px;
          bottom: 24px;
        }

        .menuItem:hover > .moveTips {
          opacity: 1;
        }

        .subActive {
          background:rgba(255,236,173,0.33);
          border-radius:6px;
        }
      }

      .secondPart {
        display: flex;
        flex: 1;
        background: #f6f6f6;
        width: 88.1%;

        .detailPart::-webkit-scrollbar {
          display: none;
        }

        .detailPart {
          background-color: #ffffff;
          border-radius:0 6px 0 0;
          width: 85.5%;
          padding-left: 177px;
          top: 180px;
          position: fixed;
          height: 78%;
          overflow: scroll;

          .curCategory {
            border-bottom:1px solid #e6e6e6;
            height:61px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            // right: 0;
            top: 180px;
            width: 75%;
            background: #ffffff;
            z-index: 99;

            .curCategoryLeft {
              font-family:PingFangSC-Light;
              font-size:20px;
              letter-spacing:1.12px;
              text-align:left;
              padding-left: 23px;

              .isCurEdit {
                border:1px solid #ffc993;
                border-radius:4px;
                padding: 0px 4px;
              }

              .isCurEditIcon {
                color: #ff8b18;
              }
            }
            .curCategoryRight {
              font-size: 12px;
              padding-right: 60px;
              cursor: pointer;
            }

            .quickEdit {
              color: #ff8b18;
            }
          }

          .dishes {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            margin-top: 55px;
            width: 97%;

            .dish {
              flex: 0 0 45%;
              box-shadow:0 3px 4px 3px rgba(0,0,0,0.04);
              border-radius:5px;
              border: 1px solid #f0f0f0;
              height:164px;
              display: flex;
              flex-direction: column;
              cursor: pointer;

              .tagLine {
                flex: 0 0 11%;
                display: flex;
                justify-content: space-between;
                margin: 10px 0;

                .leftTag {
                  display: flex;
                  .rectangle {
                    background:#ff8b18;
                    width:5px;
                    height:16px;
                  }

                  .No {
                    font-size: 14px;
                    padding-left: 6px;
                    font-family:PingFangTC-Medium;
                  }
                }

                .rightTag {
                  display: flex;

                  .deleteBtn {
                    height: 15px;
                    width: 15px;
                    margin: 0 16px;
                  }
                }
              }

              .dishBody {
                display: flex;

                .bodyLeft {
                  .dishImg {
                    border-radius:3.15px;
                    width:105px;
                    height:105px;
                    margin: 10px;
                    overflow: initial;
                  }
                }

                .bodyRight {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;

                  .dishNameLine {
                    margin: 8px 0 0px 0;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    flex: 1;

                    .dishName {
                      font-family:PingFangSC-Medium;
                      font-size:20px;
                      letter-spacing:0.31px;
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space: nowrap;
                      width: 17vw;
                      text-align:left;
                    }

                    .chilli {
                      width:18px;
                      height:18px;
                      margin-top: 4px;
                    }
                  }

                  .brief {
                    font-family:PingFangSC-Light;
                    font-size:14px;
                    color:#9b9b9b;
                    letter-spacing:0.32px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    // width: 344px;
                    width: 280px;
                    text-align: left;
                    flex: 1;
                  }

                  .tagList {
                    // margin-top: 5px;
                    flex: 1;
                    line-height: 2;

                    span {
                      padding: 2px 3px;
                      font-family:PingFangSC-Medium;
                      font-size: 13px;
                      height: 24px;
                      border-radius:3px;
                      margin-right: 5px;
                      letter-spacing:0.32px;
                    }

                    .tag1 {
                      border:1px solid #67c6ff;
                      color: #67c6ff;
                    }

                    .tag2 {
                      border:1px solid #a9d87a;
                      color:#a9d87a;
                    }

                    .tag3 {
                      border:1px solid #f8c86b;
                      color:#f8c86b;
                    }

                    .tag4 {
                      border:1px solid #ff9b7d;
                      color:#ff9b7d;
                    }
                  }

                  .price {
                    font-family:PingFangSC-Light;
                    font-size:15px;
                    color:#9b9b9b;
                    text-align:left;
                    flex: 1;
                    margin-bottom: 1px;
                    span {
                      font-family:PingFangSC-Medium;
                      font-size:23px;
                      color:#fe8966;
                      padding-right: 3px;
                    }
                  }
                }
              }
            }

            .dish:nth-child(2n+1) {
              margin: 25px 30px 0px 25px;
            }
            .dish:nth-child(2n) {
              margin: 25px 0px 0px 0;
            }
          }

          .tag {
            border-radius:4px;
            width:60px;
            height:17px;

            .circle {
              width:10px;
              height:10px;
              border-radius:100%;
              display: inline-block;
            }
            span {
              padding-left: 4px;
            }
          }

          .tagBlue {
            background: #edf8ff;

            .circle {
              background:#c8eaff;
              border:2px solid #67c6ff;
            }

            span {
              color: #67c6ff;
            }
          }

          .tagGrey {
            background: #f0f0f0;

            .circle {
              background:#ffffff;
              border:2px solid #cecece;
            }

            span {
              color:#9b9b9b;
            }
          }

          .titleLine {
            width: 100%;
            border-bottom: 1px solid #e6e6e6;
          }

          .quickEdit {
            margin-top: 60px;
          }

          .quickEditTitle {
            display: flex;
            font-family:PingFangSC-Medium;
            font-size:13px;
            color:#9b9b9b;
            letter-spacing:0.96px;
            text-align: left;
            padding: 20px 20px 20px 50px;

            div:nth-child(1) {
              flex: 2;
            }
            div:nth-child(2) {
              flex: 4;
            }
            div:nth-child(3) {
              flex: 2;
            }
            div:nth-child(4) {
              flex: 3;
            }
            div:nth-child(5) {
              flex: 2;
            }
          }

          .quickEditItem {
            display: flex;
            font-family:PingFangSC-Medium;
            font-size:13px;
            text-align: left;
            padding: 20px 20px 20px 50px;

            div:nth-child(1) {
              flex: 2;
              div {
                cursor: pointer;
              }
            }
            div:nth-child(2) {
              flex: 4;
              input {
                width: 70%;
                border-radius:4px;
                border:1px solid #e6e6e6;
                padding: 3px;
              }
            }
            div:nth-child(3) {
              flex: 2;
            }
            div:nth-child(4) {
              flex: 3;
              input {
                width: 40%;
                border-radius:4px;
                border:1px solid #e6e6e6;
                padding: 3px;
              }
            }
            div:nth-child(5) {
              flex: 2;
              span {
                cursor: pointer;
              }
            }

            img {
              border-radius:4px;
              width:50px;
              height:50px;
            }
          }

          .quickEditItem:nth-child(2n+1) {
            background: #fffbed;
          }

          .imgCol {
            position: relative;
          }

          .uploadFile {
            opacity: 0;
            width:50px;
            height:50px;
            position: absolute;
            left: 0;
          }

          .bottomHint {
            font-family:PingFangSC-Regular;
            font-size:12px;
            color:#dadada;
            letter-spacing:0.86px;
            text-align:center;
            margin-bottom: 15px;

            .shortLine {
              opacity:0.24;
              border-top:1px solid #dadada;
              width:304px;
              height:1px;
              margin: auto;
              margin-bottom: 10px;
              margin-top: 43px;
            }

            p {
              margin-bottom: 15px;
            }
          }
        }
      }
    }
  }
  .iconMiddle {
    vertical-align: middle;
  }
}
</style>
