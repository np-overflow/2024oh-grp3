from openai import OpenAI
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify, request

# Set up OpenAI API key
client = OpenAI(api_key="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")

# Sample dataset with MCQ and Open-Ended questions
topics = {
    'Science': [
        {'question': 'Who discovered penicillin?', 'type': 'Open-Ended', 'correct_answer': 'Fleming'},
    ],
    
    "Ngee Ann": [
        {'question': 'When was Ngee Ann Polytechnic founded?', 'type': 'Open-Ended', 'correct_answer': '25 May 1963'},
        {'question': 'State the dates (in full) of Ngee Ann Polytechnics open house.', 'type': 'Open-Ended', 'correct_answer': '4 January 2024, 5 January 2024, 6 January 2024'},
        {'question': 'Complete the sentence: BE PART OF ____', 'type': 'Open-Ended', 'correct_answer': 'XTRA'},
        {'question': 'How many full-time courses does NP offer?', 'type': 'Open-Ended', 'correct_answer': '41'},
        {'question': 'What is the name of the NPs library?', 'type': 'Open-Ended', 'correct_answer': 'Lien Ying Chow Library'},
        {'question': 'What is the maximum number of people that can be seated in NPs Convention Centre? ', 'type': 'Open-Ended', 'correct_answer': '1800'},
        {'question': 'How many schools does NP have?', 'type': 'Open-Ended', 'correct_answer': '9'},
        {'question': 'During the NP 2021 graduation ceremony, which minister announced the pilot run of the Personalised Learning Pathway which allows students to have the opportunity to graduate with a minor on top of their diploma?', 'type': 'Open-Ended', 'correct_answer': 'Lawrence Wong'},
        {'question': 'Which local artiste recently enrolled in NP as a student?', 'type': 'Open-Ended', 'correct_answer': 'Dennis Chew'},
        {'question': 'NPs original aim was to become a university. True or False?', 'type': 'Open-Ended', 'correct_answer': 'True'},
        {'question': 'State the vehicle that is situated in front of the aerospace hub.', 'type': 'Open-Ended', 'correct_answer': 'Bell huey helicopter'},
    ],
    "IT": [
        {'question': 'ICT Society is an SIG. True or False?', 'type': 'Open-Ended', 'correct_answer': 'False'},
        {'question': 'When you quote or paraphrase a line from a book in your assignment, you should A.Attribute the source in the body of the assignment after the quote, and in the reference or bibliography list. B.Attribute the source only if it is not from your recommended textbook. C. Attribute the source in the body of the assignment after the quote only. D. Attribute the source in the reference or bibliography list only. (Type your answer in terms of A, B, C or D)', 'type': 'Open-Ended', 'correct_answer': 'A'},
        {'question': 'Yes, I can download the video because A. I will delete the video after the presentation and just give the link to my lecturer B. The video is Creative Commons Licensed and I will attribute the source. (Type your answer in terms of A, B, or Both)', 'type': 'Open-Ended', 'correct_answer': 'Both'},
        {'question': 'Which Python function tells me the length of a string?', 'type': 'Open-Ended', 'correct_answer': 'len()'},
        {'question': 'Which of the following is an example of thinking computationally? A.When going to meet a friend, wander around until you find your friend. B. When going to meet a friend, ask Google Maps to plan the most efficient route for you. C.When going to meet a friend, decide to ask your friend to come and meet you instead. D. When going to meet a friend, planning out your route to save travelling time. (Type your answer in terms of A, B, C or D)', 'type': 'Open-Ended', 'correct_answer': 'D'},
        {'question': 'Briefly describe what the Diploma in IT course is about.', 'type': 'Open-Ended', 'correct_answer': 'Information Technology is a broad base diploma where students gain a strong foundation in areas such as programming, networking, databases and operating systems. The diploma also allows students to pick from a wide range of elective modules that specialises in different disciplines.'},
        {'question': 'State the four specialisations offered under the Diploma in IT course.', 'type': 'Open-Ended', 'correct_answer': 'artificial intelligence, cloud computing, software engineering, enterprise computing'},
        {'question': 'I cannot join any ICT SIGs if I am from another school in NP. True or False?', 'type': 'Open-Ended', 'correct_answer': 'False'},
        {'question': 'Briefly describe what the Diploma in Data Science course is about.', 'type': 'Open-Ended', 'correct_answer': 'Data Science is a diploma that harnesses students with the power of analytics and transforms data into value. This course will help build core skills in programming, databases and analytics, as well as learn key statistical concepts and data visualisation techniques for analyses and presentations. With modules such as Machine learning and Data Wrangling, this course will equip you with the tools to get a great kickstart into your data science journey​'},
        {'question': '', 'type': 'Open-Ended', 'correct_answer': ''},
        
    ],
    "Math": [
        {'question': 'A bag contains 13 pink counters and 6 green counters. Two counters are taken from the bag at random without replacement. Find the probability that only one of the counters is green.', 'type': 'Open-Ended', 'correct_answer': '26/57'},
        {'question': 'How many five-letter words can be made using letters in the word “SESSIONS” with no replacement of letters?', 'type': 'Open-Ended', 'correct_answer': '500'},
        {'question': 'Differentiate sin x', 'type': 'Open-Ended', 'correct_answer': 'cos x'},
        {'question': 'A map of Korea has a scale of 1 : 2500 000. The length of the Han River on the map is 49.3 cm. Calculate the actual length, in kilometres of the Han River.', 'type': 'Open-Ended', 'correct_answer': '1232.5 km'},
        {'question': 'In 2016, the number of passengers passing through Changi Airport was 5.41 * 10^7. Calculate the mean number of passengers passing through the airport each month. Give your answer in millions, correct to 3 significant figures.', 'type': 'Open-Ended', 'correct_answer': '4.51 million (3s.f.)'},
        {'question': 'Simplify 5p - 3(p-2)', 'type': 'Open-Ended', 'correct_answer': '2p+6'},
        {'question': 'A = (b(c+2))/ (5-c). Rearrange the formula to make c the subject', 'type': 'Open-Ended', 'correct_answer': 'c = (5A-2B)/(A+B)'},
        {'question': 'Solve (3x-4) / 2 - 2x/3 = 1', 'type': 'Open-Ended', 'correct_answer': '3.6'},
        {'question': 'Whose theorem states that a^2 + b^2 = c^2', 'type': 'Open-Ended', 'correct_answer': 'Pythagoras'},
        {'question': 'Find the prime factor of 1188, giving your answer in index form', 'type': 'Open-Ended', 'correct_answer': '2^2 * 3^3 * 11'},
    ]
}

# Flask Implimentation
app = Flask(__name__)

@app.route("/")
def home():
    return "HELLO"

@app.route("/questions", methods=["GET"])
def questionsEndpoint():
    args = request.args
    topic = args.get("topic")
    return jsonify({
        "response": "success",
        "questions": topics[topic]
    }), 200
    
@app.route("/verifyans", methods=["GET"])
def verifyAnswerEndpoint():
    args = request.args
    pass

def get_vector_embedding(text):
    # Use ChatGPT API for generating embeddings
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # You can choose the engine based on your requirements
        messages=[
          {"role": "system", "content": "You are an expert in analysing the similarity between the user"},
          {"role": "user", "content": f"Analyze similarity between: {text}"},
        ],
        temperature=0,
        max_tokens=0,
        n=1,
        stop=None,
    )

    # Extract the last response as the generated text
    generated_text = response['choices'][0]['text']

    # Extract the vector part from the generated text
    # Modify this extraction based on the format of the response from the ChatGPT API
    vector_str = generated_text  # Placeholder, modify as needed

    # Convert the string representation of the vector to a numpy array
    vector_embedding = np.array([float(value) for value in vector_str.split()])

    return vector_embedding


def cosine_similarity_score(embedding1, embedding2):
    # Reshape the embeddings to make them compatible for cosine similarity calculation
    embedding1 = embedding1.reshape(1, -1)
    embedding2 = embedding2.reshape(1, -1)

    # Calculate cosine similarity
    similarity_score = cosine_similarity(embedding1, embedding2)[0, 0]

    return similarity_score

def verify_answer(user_answer, correct_answer, question_type):
    # For MCQ, just directly compare since it's a fixed number of options.
    if question_type == 'MCQ':
        if user_answer == correct_answer:
          return True # save money for API request since MCQ doesn't need similarity testing
        else:
          return False

    # Use ChatGPT API for generating similarity score
    response = client.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": "You are an expert in analysing the similarity between the user's answer and correct answer"},
          {"role": "user", "content": f"Compare similarity between: User: {user_answer} | Correct: {correct_answer}. Return"},
        ],
        temperature=0,
        max_tokens=0,
        n=1,
        stop=None,
    )

    # Extract the similarity score from the response
    similarity_score = float(response['choices'][0]['text'])

    # Set a threshold for similarity
    threshold = 0.7

    # Verify the answer based on the similarity score
    return similarity_score > threshold

def ask_question(question_data):
    question = question_data['question']
    question_type = question_data['type']
    options = question_data.get('options', [])

    print(question)

    if question_type == 'MCQ':
        print("Options:")
        for i, option in enumerate(options, start=1):
            print(f"{i}. {option}")

        # Get user's answer for MCQ
        user_choice = int(input("Your choice (enter the number): "))
        user_answer = options[user_choice - 1]
    else:
        # Get user's answer for Open-Ended
        user_answer = input("Your answer: ")

    return user_answer

def trivia_game():
    total_score = 0

    while True:
        # Allow user to select a topic (replace this with your UI logic)
        selected_topic = input("Select a topic (Science/History): ")

        if selected_topic not in topics:
            print("Invalid topic. Please select a valid topic.")
            continue

        topic_questions = topics[selected_topic]

        for question_data in topic_questions:
            user_answer = ask_question(question_data)
            correct_answer = question_data['correct_answer']
            question_type = question_data['type']

            # Verify user's answer
            if verify_answer(user_answer, correct_answer, question_type):
                print("Correct!")
                total_score += 1
            else:
                print(f"Wrong! The correct answer is: {correct_answer}")

        # Display total score for the selected topic
        print(f"Your total score for {selected_topic}: {total_score}")

        # Allow user to play again or exit (replace this with your UI logic)
        play_again = input("Do you want to play again? (yes/no): ")
        if play_again.lower() != 'yes':
            break

if __name__ == "__main__":
    trivia_game()
    app.run()