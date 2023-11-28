var P = Parsimmon;
var whitespace = P.regexp(/\s*/m);

function token(parser) {
    return parser.skip(whitespace);
}

function word(str) {
    return P.string(str).thru(token);
}

function toHTMLString(num) {
    if(!(num instanceof HugeNumber)) {
        num = new HugeNumber(num);
    }
    var n = num.toNumber();
    if (this.sign === -1) {
        return "-" + toHTMLString(num.neg());
    } else if (num.eq(Infinity) || num.lt(1e+21)) {
        return num.toNumber().toString();
    } else if (num.lt(new HugeNumber(1, [5, 2]))) {
        var logarithm = num.log10();
        var logNum = logarithm.toNumber();
        if (Number.isFinite(logNum)) {
            return Math.pow(10, logNum - Math.floor(logNum)).toString() + " &times; 10<sup>" + toHTMLString(Math.floor(logNum)) + "</sup>";
        } else {
            return toHTMLString(logarithm.sub(logarithm.floor()).exp10()) + " &times; 10<sup>" + toHTMLString(logarithm.floor()) + "</sup>";
        }
    } else if (num.array.length === 2 && num.array[1] < 6) {
        return "10" + "&uarr;".repeat(num.array[1]) + toHTMLString(num.array[0]);
    } else {
        return num.array.map(toHTMLString).join(" &rarr; ");
    }
}

let UberCalcParser = P.createLanguage({
    expr: r =>
        r.addExpr.thru(
            parser => whitespace.then(parser)
        ),
    addExpr: r =>
        r.subExpr
            .sepBy(word("+"))
            .map(x => x.reduce((a, b) => a.add(b))),
    subExpr: r =>
        r.mulExpr
            .sepBy(word("-"))
            .map(x => x.reduce((a, b) => a.sub(b))),
    mulExpr: r =>
        r.divExpr
            .sepBy(word("*"))
            .map(x => x.reduce((a, b) => a.mul(b))),
    divExpr: r =>
        r.modExpr
            .sepBy(word("/"))
            .map(x => x.reduce((a, b) => a.div(b))),
    modExpr: r =>
        r.powExpr
            .sepBy(word("%"))
            .map(x => x.reduce((a, b) => a.mod(b))),
    powExpr: r =>
        r.parenExpr
            .sepBy(word("^"))
            .map(x => x.reduce((a, b) => a.pow(b))),
    parenExpr: r =>
        P.alt(P.seq(word("("), r.expr, word(")")).map(x => x[1]), r.number),
    number: () =>
        token(P.regexp(/[+-]?[0-9]+([.][0-9]+)?/))
            .sepBy(P.regexp(/[eE]/))
            .map(x => new HugeNumber(x.join("e"))),
});


function calculate() {
    var expr = $("#expr").val();
    try {
        if (expr === "help") {
            $("#results").append("xey - Scientific notation (x&times;10<sup>y</sup>)<br />x + y - Add<br />");
        } else {
            $("#results").append(expr + " = <b>" + toHTMLString(UberCalcParser.expr.tryParse(expr)) + "</b>");
        }
    } catch (e) {
        $("#results").append("Error<br />");
        throw e;
    }
    $("#results").append("<br />");
}