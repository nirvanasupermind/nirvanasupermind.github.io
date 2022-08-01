var P = Parsimmon;

const DEFAULT_PREC = Math.pow(12, 12);

// Terms used in gamma function approximation

const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
];

const SQRT_2PI = Math.sqrt(2 * Math.PI);

// Converts a numeric dozenal string to a number
function parseDozenalString(str) {
    str = str.toLowerCase().trim();

    // Check for negatives
    if (str[0] == "-") {
        return -parseDozenalString(str.slice(1));
    }

    // Check for Infinity and NaN
    if (str == "infinity") {
        return Number.POSITIVE_INFINITY;
    }

    // Check for Infinity and NaN
    if (str == "nan") {
        return Number.NaN;
    }

    // Check for integers
    if (!str.includes(".")) {
        // In case of integers, we can use built-in parseInt function for base conversion of integers

        return parseInt(str, 12);
    }

    var intPartString = str.split(".")[0];

    var fracPartString = str.split(".")[1];

    // The  nteger part of the parsed number
    var intPart = parseInt(intPartString, 12);

    // The fractional part of the parsed numbe
    var fracPart = parseInt(fracPartString, 12) / Math.pow(12, fracPartString.length);

    return intPart + fracPart;
}

function token(parser) {
    return parser.skip(P.optWhitespace);
}

function word(str) {
    return P.string(str).thru(token);
}

function foldr(foldFn, [element, ...rest]) {
    if (rest.length === 0) {
        return element;
    }
    return foldFn(element, foldr(foldFn, rest));
}


function gamma(num) {
    var i;
    var g = 7;
    if (num < 0.5) return Math.PI / (Math.sin(Math.PI * num) * gamma(1 - num));
    num -= 1;
    var a = p[0];
    var t = num + g + 0.5;
    for (i = 1; i < p.length; i++) {
        a += p[i] / (num + i);
    }
    return SQRT_2PI * Math.pow(t, num + 0.5) * Math.exp(-t) * a;
}

var DozenalMath = P.createLanguage({
    Exp(r) {
        return r.AddExp;
    },
    AddExp(r) {
        return r.SubExp.sepBy(word("+")).map((res) => res.reduce((a, b) => a + b));
    },
    SubExp(r) {
        return r.MulExp.sepBy(word("-")).map((res) => res.reduce((a, b) => a - b));
    },
    MulExp(r) {
        return r.DivExp.sepBy(word("*")).map((res) => res.reduce((a, b) => a * b));
    },
    DivExp(r) {
        return r.ModExp.sepBy(word("/")).map((res) => res.reduce((a, b) => a / b));
    },
    ModExp(r) {
        return r.PowExp.sepBy(word("%")).map((res) => res.reduce((a, b) => a % b));
    },
    PowExp(r) {
        return r.CallExp.sepBy(word("^")).map((res) => foldr(Math.pow, res));
    },
    CallExp(r) {
        return P.alt(
            P.seq(word("pi"), r.Args).map((res) => Math.PI),
            P.seq(word("e"), r.Args).map((res) => Math.E),
            P.seq(word("sin"), r.Args).map((res) => Math.sin(res[1][0])),
            P.seq(word("cos"), r.Args).map((res) => Math.cos(res[1][0])),
            P.seq(word("tan"), r.Args).map((res) => Math.tan(res[1][0])),
            P.seq(word("asin"), r.Args).map((res) => Math.asin(res[1][0])),
            P.seq(word("acos"), r.Args).map((res) => Math.acos(res[1][0])),
            P.seq(word("atan"), r.Args).map((res) => Math.atan(res[1][0])),
            P.seq(word("sinh"), r.Args).map((res) => Math.sinh(res[1][0])),
            P.seq(word("cosh"), r.Args).map((res) => Math.cosh(res[1][0])),
            P.seq(word("tanh"), r.Args).map((res) => Math.tanh(res[1][0])),
            P.seq(word("asinh"), r.Args).map((res) => Math.asinh(res[1][0])),
            P.seq(word("acosh"), r.Args).map((res) => Math.acosh(res[1][0])),
            P.seq(word("atanh"), r.Args).map((res) => Math.atahh(res[1][0])),
            P.seq(word("log"), r.Args).map((res) => Math.log(res[1][0])),
            P.seq(word("logz"), r.Args).map((res) => Math.log(res[1][0]) / Math.log(12)),
            P.seq(word("exp"), r.Args).map((res) => Math.exp(res[1][0])),
            P.seq(word("expz"), r.Args).map((res) => Math.pow(12, res[1][0])),
            P.seq(word("sqrt"), r.Args).map((res) => Math.sqrt(res[1][0])),
            P.seq(word("gamma"), r.Args).map((res) => gamma(res[1][0])),
            r.UnaryExp
        );
    },
    Args(r) {
        return P.alt(
            P.seq(word("("), word(")")),
            r.Exp.sepBy(word(",")).wrap(word("("), word(")"))
        );
    },
    UnaryExp(r) {
        return P.alt(
            P.seq(word("-"), r.UnaryExp).map((res) => -res[1]),
            r.ParenExp
        );
    },
    ParenExp(r) {
        return P.alt(
            r.Exp.wrap(word("("), word(")")),
            r.NumExp
        );
    },
    NumExp() {
        return token(P.regexp(/Infinity|NaN|([0-9ABab]+(\.[0-9ABab]*)?)/)).map(parseDozenalString);
    }
});

function calculate() {
    var exp = document.getElementById("exp").value;

    if (exp.trim() == "") {
        return;
    }

    try {
        var result = DozenalMath.Exp.tryParse(exp);
        document.getElementById("results").innerHTML += "<li>" + exp + " = <b>" + result.toString(12) + "</b></li>";
    } catch (e) {
        document.getElementById("results").innerHTML += "<li><b>Encounted error</b></li>";
        console.log("Error message for debugging: \n" + e.toString());
    }
    return result;
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
}