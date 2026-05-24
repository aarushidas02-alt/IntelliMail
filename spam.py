import pandas as pd

from sklearn.feature_extraction.text import (
    TfidfVectorizer
)

from sklearn.naive_bayes import (
    MultinomialNB
)

from sklearn.model_selection import (
    train_test_split
)

from sklearn.metrics import (
    accuracy_score
)


# LOAD DATASET
df = pd.read_csv(

    "dataset/emails.csv",

    encoding="latin-1"

)

# KEEP REQUIRED COLUMNS
df = df[["v1", "v2"]]

# RENAME COLUMNS
df.columns = ["label", "text"]

# REMOVE EMPTY VALUES
df["text"] = df["text"].fillna("")

# CONVERT LABELS
df["label"] = df["label"].map({

    "ham": 0,

    "spam": 1

})

# INPUT + OUTPUT
X = df["text"]

y = df["label"]

# TRAIN TEST SPLIT
X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.2,

    random_state=42

)

# TF-IDF VECTORIZATION
vectorizer = TfidfVectorizer(

    stop_words="english",

    lowercase=True

)

X_train_vectorized = vectorizer.fit_transform(
    X_train
)

X_test_vectorized = vectorizer.transform(
    X_test
)

# TRAIN MODEL
model = MultinomialNB()

model.fit(

    X_train_vectorized,

    y_train

)

# MODEL ACCURACY
predictions = model.predict(
    X_test_vectorized
)

accuracy = accuracy_score(

    y_test,

    predictions

)

print(

    "\nModel Accuracy:",

    round(accuracy * 100, 2),

    "%"

)


# CATEGORY PREDICTION
def predict_category(text):

    text = str(text)

    lower_text = text.lower()

    # VECTORIZE INPUT
    text_vectorized = vectorizer.transform(
        [text]
    )

    # ML SPAM PREDICTION
    prediction = model.predict(
        text_vectorized
    )[0]

    # SPAM DETECTION
    if prediction == 1 or any(
        word in lower_text for word in [

            "lottery",
            "claim prize",
            "click here",
            "verify account",
            "free money",
            "urgent action",
            "crypto",
            "win money",
            "congratulations",
            "gift card"

        ]
    ):

        return "spam"

    # BANKING
    elif any(word in lower_text for word in [

        "famapp",
        "fampay",
        "bank",
        "credited",
        "debited",
        "upi",
        "transaction",
        "payment",
        "account balance",
        "netbanking",
        "withdrawal",
        "deposit",
        "cashback",
        "reward points",
        "card",
        "visa",
        "mastercard",
        "refund",
        "received rs",
        "sent rs",
        "money transfer",
        "paytm",
        "gpay",
        "phonepe",
        "sbi",
        "hdfc",
        "icici",
        "axis bank"

    ]):

        return "banking"

    # SOCIAL
    elif any(word in lower_text for word in [

        "instagram",
        "facebook",
        "twitter",
        "linkedin",
        "snapchat",
        "discord",
        "reddit",
        "friend request",
        "follow",
        "message",
        "notification"

    ]):

        return "social"

    # EDUCATION
    elif any(word in lower_text for word in [

        "hackerank",
        "linkedin",
        "geekforgeeks",
        "sjbit",
        "internshala",
        "leetcode",
        "coding",
        "c++",
        "course",
        "assignment",
        "class",
        "exam",
        "college",
        "university",
        "certificate",
        "internship",
        "vtu",
        "attendance",
        "semester",
        "results",
        "nptel",
        "webinar",
        "quiz"

    ]):

        return "education"

    # PROMOTIONS
    elif any(word in lower_text for word in [

        "offer",
        "sale",
        "discount",
        "deal",
        "buy now",
        "limited time",
        "amazon",
        "flipkart",
        "myntra",
        "swiggy",
        "zomato",
        "coupon",
        "shopping",
        "festival sale"

    ]):

        return "promotions"

    # DEFAULT
    else:

        return "general"


# CONFIDENCE SCORE
def predict_confidence(text):

    text = str(text)

    text_vectorized = vectorizer.transform(
        [text]
    )

    probabilities = model.predict_proba(
        text_vectorized
    )[0]

    confidence = max(probabilities) * 100

    return round(confidence, 2)


# TRAIN MODEL FUNCTION
def train_model():

    return model, vectorizer