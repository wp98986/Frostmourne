import React, { Component } from 'react';
import classNames from 'classnames';
import defaultStyles from './index.less';

function calSpecValues(param) {
  // 计算规格属性的可选范围
  const {
    newSelectedItem, // 最新选中的值
    selectedSpecValues, // 已经选中的所有值
    allSpecNameList, // 所有可选范围
    products = [], // 商品信息
    caledSpecIds = [], // 已经计算过的规格
  } = param;
  let existNewSelectedSpecproducts = products;
  let newSelectedSpecValues = selectedSpecValues;

  if (newSelectedItem) {
    caledSpecIds.push(newSelectedItem.spec.id);
    // 根据新选中的值替换已经选中的所有值，通过遍历allSpecNameList，保证规格值的顺序
    newSelectedSpecValues = [];
    allSpecNameList.forEach(spec => {
      if (spec.specId === newSelectedItem.spec.id) {
        newSelectedSpecValues.push(newSelectedItem);
      } else {
        const specValues = selectedSpecValues.find(value => value.spec.id === spec.specId);
        if (specValues) {
          newSelectedSpecValues.push(specValues);
        }
      }
    });
    // 遍历所有兄弟货品下的所有规格,找到当前选中值,赋进匹配货品列表
    existNewSelectedSpecproducts = [];
    products.forEach(brotherGoodsInfo => {
      if (brotherGoodsInfo.goodsOpenSpecValues != null) {
        brotherGoodsInfo.goodsOpenSpecValues.forEach(brotherInfoSpec => {
          if (brotherInfoSpec.id === newSelectedItem.id) {
            existNewSelectedSpecproducts.push(brotherGoodsInfo);
          }
        });
      }
    });
  }

  // 第一次时候清空规格下表下可选择
  if (caledSpecIds.length <= 1) {
    allSpecNameList.forEach(specNameItem => {
      specNameItem.specValues.forEach(specValue => {
        const tempValue = specValue;
        tempValue.canBeSelect = true;
      });
    });
  }
  // 计算规格是否可选
  allSpecNameList.forEach(({ specId, specValues }) => {
    if (newSelectedItem && specId === newSelectedItem.spec.id) {
      return;
    }
    for (let i = 0; i < specValues.length; i += 1) {
      const specValue = specValues[i];
      let hasGoods = false;
      existNewSelectedSpecproducts.forEach(({ goodsOpenSpecValues = [] }) => {
        goodsOpenSpecValues.forEach(existSpec => {
          if (existSpec.id === specValue.id) {
            // 匹配到规格值id
            hasGoods = true;
          }
        });
      });
      if (!hasGoods) {
        specValue.canBeSelect = false;
      }
    }
  });

  // 筛选已选列表中实际不能选的规格
  const canNotSelectSpecValues = [];
  newSelectedSpecValues.forEach(newSelectedSpecValue => {
    let existSpecValueCount = 0;
    existNewSelectedSpecproducts.forEach(existNewSelectedSpecGoodsInfo => {
      existNewSelectedSpecGoodsInfo.goodsOpenSpecValues.forEach(existSpec => {
        if (newSelectedSpecValue.id === existSpec.id) {
          // 已选规格不是最新点击规格,且不等于可存在规格,+1
          existSpecValueCount += 1;
        }
      });
    });
    // 已选规格满值,既不存在,去除已选
    if (existSpecValueCount === 0) {
      canNotSelectSpecValues.push(newSelectedSpecValue);
    }
  });
  canNotSelectSpecValues.forEach(item => {
    caledSpecIds.push(item.spec.id);
    newSelectedSpecValues.splice(newSelectedSpecValues.findIndex(v => v.id === item.id), 1);
  });

  // 获取下一个需要计算的规格
  const nextSelectedItem = newSelectedSpecValues.find(v => caledSpecIds.indexOf(v.spec.id) === -1);
  if (!nextSelectedItem) {
    return { selectedSpecValues: newSelectedSpecValues, allSpecNameList };
  }

  return calSpecValues({
    newSelectedItem: nextSelectedItem,
    selectedSpecValues: newSelectedSpecValues,
    allSpecNameList,
    products,
    caledSpecIds,
  });
}

// 转换商品数据
function convertGoods({ productSpecs, goodsSpecs, products }) {
  const selectedSpecValuesModel = [...productSpecs];
  const allSpecNameList = [];
  // 先组装出所有的规格名称,规格值数组
  goodsSpecs.forEach(value => {
    let added = false;
    allSpecNameList.forEach(specNameItem => {
      if (specNameItem.specName === value.spec.specName) {
        specNameItem.specValues.push(value);
        added = true;
      }
    });
    if (!added) {
      allSpecNameList.push({
        specName: value.spec.specName,
        specId: value.spec.id,
        specValues: [value],
      });
    }
  });
  const { selectedSpecValues = [], allSpecNameList: newAllSpecNameList } = calSpecValues({
    selectedSpecValues: selectedSpecValuesModel,
    allSpecNameList,
    products,
  });
  return { selectedSpecValues, allSpecNameList: newAllSpecNameList };
}

function getProduct(param) {
  const { products, selectedSpecValues } = param;
  let selectedGoods;
  products.forEach(goodInfo => {
    const { goodsOpenSpecValues = [] } = goodInfo;
    let specCount = 0;
    goodsOpenSpecValues.forEach(brotherInfoSpec => {
      if (
        selectedSpecValues.find(selectedSpecValue => selectedSpecValue.id === brotherInfoSpec.id)
      ) {
        // 当前兄弟货品规格匹配到已选规格
        specCount += 1;
      }
    });
    if (specCount === goodsOpenSpecValues.length) {
      selectedGoods = goodInfo;
    }
  });
  return selectedGoods;
}

class SpecSelector extends Component {
  specValueChange = (selectedItem, hasSelect) => {
    const { products, allSpecNameList: oldAllSpecNameList, onChange } = this.props;
    let { selectedSpecValues: oldSelectedSpecValues } = this.props;
    if (hasSelect) {
      oldSelectedSpecValues = oldSelectedSpecValues.filter(
        specVlaue => specVlaue.spec.id !== selectedItem.spec.id
      );
    }
    const newSelectedItem = hasSelect ? null : selectedItem;

    const { selectedSpecValues, allSpecNameList } = calSpecValues({
      newSelectedItem,
      selectedSpecValues: oldSelectedSpecValues,
      allSpecNameList: oldAllSpecNameList,
      products,
    });

    // 如果选中，修改当前商品
    const newProduct = getProduct({ products, selectedSpecValues });

    onChange({
      product: newProduct,
      selectedSpecValues,
      allSpecNameList,
    });
  };

  renderSpecItem({ specValue, selectedSpecValues, styles }) {
    const { id, canBeSelect, specValueRemark } = specValue;
    const hasSelect = selectedSpecValues.find(selectedSpecValue => selectedSpecValue.id === id);

    let specValueStyle = styles.specValue;
    if (!canBeSelect) {
      specValueStyle = styles.specValueCantSelect;
    }
    if (hasSelect) {
      specValueStyle = styles.specValueSelect;
    }

    return (
      <div
        key={id}
        className={classNames(styles.specValueItem, specValueStyle)}
        onClick={
          canBeSelect
            ? e => {
                e.stopPropagation();
                this.specValueChange(specValue, hasSelect);
              }
            : null
        }
      >
        {hasSelect ? <div className={styles.productBaseViewSpecCheckFlag} /> : null}
        {specValueRemark}
      </div>
    );
  }

  renderSpecs() {
    const {
      selectedSpecValues = [],
      allSpecNameList = [],
      styles: custStyles = {},
      minSpecPerRow,
    } = this.props;
    const styles = { ...defaultStyles, ...custStyles };

    return allSpecNameList.map(item => {
      const { specValues } = item;
      let newSpecValues = [];
      if (!minSpecPerRow) {
        newSpecValues = specValues.map(specValue =>
          this.renderSpecItem({ specValue, selectedSpecValues, styles })
        );
      } else {
        let count = 0;
        let tempSpecValues = [];
        for (let index = 0; index < specValues.length; index++) {
          const specValue = this.renderSpecItem({
            specValue: specValues[index],
            selectedSpecValues,
            styles,
          });
          tempSpecValues.push(specValue);
          count += 1;
          if (count === minSpecPerRow) {
            newSpecValues.push(
              <div key={index} className={styles.specValueWrap}>
                {tempSpecValues}
              </div>
            );
            count = 0;
            tempSpecValues = [];
          }
        }
        if (tempSpecValues.length !== 0) {
          newSpecValues.push(
            <div key={0} className={styles.specValueWrap}>
              {tempSpecValues}
            </div>
          );
        }
      }

      return (
        <div className={styles.specItem} key={item.specId}>
          <div className={styles.specTitle}>{item.specName}</div>
          <div className={styles.specValues}>{newSpecValues}</div>
        </div>
      );
    });
  }

  render() {
    const { selectedSpecValues = [], styles: custStyles = {}, selectedExt } = this.props;
    const styles = { ...defaultStyles, ...custStyles };

    const selectedNodeArr = [];
    for (let i = 0; i < selectedSpecValues.length; i++) {
      const item = selectedSpecValues[i];
      const { specValueRemark } = item;
      selectedNodeArr.push(specValueRemark);
    }

    return (
      <div className={styles.productSpecContainer}>
        <div className={styles.productSpecSelector}>{this.renderSpecs()}</div>
        {selectedNodeArr && selectedNodeArr.length > 0 ? (
          <div className={styles.productSpecSelected}>
            <span className={styles.productSpecSelectedLable}>已选择</span>
            <span className={styles.productSpecSelectedValue}>{selectedNodeArr.join('、')}</span>
            {selectedExt}
          </div>
        ) : null}
      </div>
    );
  }
}

SpecSelector.convertGoods = convertGoods;

export default SpecSelector;
