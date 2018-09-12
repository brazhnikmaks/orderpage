function OrderFormation (selectProductsNode, productOutputTable, ajaxAction) {
	this.productNode = $(selectProductsNode);
	this.productOutput = $(productOutputTable);
	this.ajaxUrl = ajaxAction;
	this.cashbackPercent = 0.2;
	this.productsOption = {};

	this.sumPrice = 0;
	this.sumCashback = 0;

	this._setEvents();
	this._initProducts();

	return this;
}

OrderFormation.prototype._initProducts = function() {
	var i;
	for (i = 0; i < this.productNode[0].length; i++) {
		this.productsOption[this.productNode[0][i].value] = {
			"name" : this.productNode[0][i].innerHTML,
			"status" : 1
		}
	}
}

OrderFormation.prototype._getProduct = function(productId) {
	var _this = this;
	var ajax = _this._sendAjax(this.ajaxUrl, "POST", {"idProduct" : productId});

	ajax.done(function(json) {
		_this._drawProduct(jQuery.parseJSON(json));
	}).fail(function() {
		//error frontend
		_this._ajaxError();
	});
}

OrderFormation.prototype._sendAjax = function(ajaxUrl, method, ajaxData) {
	return $.ajax({
		type: method,
		url: ajaxUrl,
		data: ajaxData,
	});
}

OrderFormation.prototype._ajaxError = function() {
	console.log("error ajax");
}

OrderFormation.prototype._setEvents = function () {
	var _this = this;

	if(_this.productNode.length) {
		_this.productNode.on("change", function() {
			if(this.value != 0)
				var prod = _this._getProduct(this.value);
		});
	}

	$(document).on("click", ".js-removeProduct", function() {
		var curProdId = $(this).closest("tr").attr("data-id");
		_this._removeProduct(curProdId);
	});

	$(document).on("input", ".js-changeCount", function() {
		if(this.value >= 1) {
			var curRow = $(this).closest("tr"),
					curProdId = curRow.attr("data-id");
			_this._updatePrice(this.value, curProdId, curRow);
		}
	});
}

OrderFormation.prototype._reInitProductOptions = function() {
	this.productNode.html("");
	for( var id in this.productsOption ) {
		if (this.productsOption[id].status && this.productsOption[id].status != 0)
			this.productNode.append("<option value=\"" + id + "\">" + this.productsOption[id].name + "</option>");
	}
	if(this.productNode[0].length <= 1 && this.productsOption[0].status == 1) {
		this.productNode.hide(0);
	} else {
		this.productNode.show(0);
	}
}

OrderFormation.prototype._displayTable = function() {
	if($("[data-id]").length) {
		this.productOutput.show(0);
	} else {
		this.productOutput.hide(0);
	}
}

OrderFormation.prototype._drawProduct = function(product) {
	var productId = product.id,
			productName = product.name,
			productCategory = product.category,
			productPrice = parseFloat(product.price),
			productOldprice = parseFloat(product.old_price);
			productCount = 1;
			productCashback = (productPrice * this.cashbackPercent).toFixed(3);

	if(this.productsOption) {
		this.productsOption[productId].price = productPrice;
		this.productsOption[productId].old_price = productOldprice;
		this.productsOption[productId].status = 0;
	}

	var productRow = "<tr data-id=" + productId + "> \
		<td><div class=\"js-removeProduct\" style=\"cursor: pointer\">НАЙУХ</div></td> \
		<td><img src=\"http://localhost/modx/assets/images/products/5/small/diper.jpg\" alt=\"\" /></td> \
		<td><div>" + productCategory + "</div><div><b>" + productName + "</b></div></td> \
		<td><input class=\"js-changeCount\" min=\"1\" type=\"number\" value=\"" + productCount + "\" /></td> \
		<td><div style=\"text-decoration: line-through\"><span class=\"js-oldPrice\">" + productOldprice + "</span>€</div><div><span class=\"js-price\">" + productPrice + "</span>€</div></td> \
		<td><span  class=\"js-cashback\">" + productCashback + "</span>€</td> \
		</tr>";
	this.productOutput.append(productRow);

	this._reInitProductOptions();
	this._displayTable();
	this._sum();
}

OrderFormation.prototype._removeProduct = function(productId) {
	this.productOutput.find("[data-id=" + productId + "]").remove();

	if(this.productsOption) {
		this.productsOption[productId].status = 1;
	}

	this._reInitProductOptions();
	this._displayTable();
	this._sum();
}

OrderFormation.prototype._updatePrice = function(count, prodId, productRow) {
	//расширить по формулам подсчета до 10 продуктов
	var newPrice = this.productsOption[prodId].price * count,
			newOldprice = this.productsOption[prodId].old_price * count,
			newCashback = (newPrice * this.cashbackPercent).toFixed(3);

	productRow.find(".js-price").text(newPrice);
	productRow.find(".js-oldPrice").text(newOldprice);
	productRow.find(".js-cashback").text(newCashback);
	this._sum();
}

OrderFormation.prototype._sum = function() {
	var productRows = $("[data-id]"),
			i;

	this.sumPrice = 0;
	this.sumCashback = 0;

	for(var i = 0; i < productRows.length; i++) {
		this.sumPrice += parseFloat($(productRows[i]).find(".js-price").text());
		this.sumCashback += parseFloat($(productRows[i]).find(".js-cashback").text());
	}

	$(".js-sumPrice").text(this.sumPrice);
	$(".js-sumCashback").text(this.sumCashback);
}
var formOrder = new OrderFormation("#productSelect", ".productsRow", "ajaxProduct.php");