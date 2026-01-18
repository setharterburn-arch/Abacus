"""
Subtraction with Regrouping Tutorial - Manim Animation
Teaches subtraction with borrowing (23 - 15 = 8)
"""

from manim import *

class SubtractionTutorial(Scene):
    def construct(self):
        # Title
        title = Text("Subtraction with Regrouping", font_size=48, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.scale(0.6).to_edge(UP))
        
        # Show problem in vertical format
        problem = MathTex(
            r"\begin{array}{r} 23 \\ - 15 \\ \hline \end{array}",
            font_size=72
        )
        self.play(Write(problem))
        self.wait(1)
        self.play(problem.animate.shift(LEFT * 3))
        
        # Explanation text
        explanation = Text("Let's solve this step by step!", font_size=32, color=YELLOW)
        explanation.to_edge(DOWN)
        self.play(Write(explanation))
        self.wait(1)
        
        # Step 1: Ones place
        step1 = Text("Step 1: Ones place (3 - 5)", font_size=28, color=WHITE)
        step1.next_to(problem, RIGHT, buff=1.5).shift(UP)
        self.play(Write(step1))
        
        # Highlight ones place
        ones_box = SurroundingRectangle(
            VGroup(problem[0][1], problem[0][4]),
            color=YELLOW,
            buff=0.1
        )
        self.play(Create(ones_box))
        self.wait(1)
        
        # Problem: 3 < 5
        problem_text = Text("Problem: 3 < 5", font_size=24, color=RED)
        problem_text.next_to(step1, DOWN, aligned_edge=LEFT)
        self.play(Write(problem_text))
        self.wait(1)
        
        # Solution: Borrow from tens
        solution_text = Text("Solution: Borrow from tens!", font_size=24, color=GREEN)
        solution_text.next_to(problem_text, DOWN, aligned_edge=LEFT)
        self.play(Write(solution_text))
        self.wait(1)
        
        # Show regrouping visually
        self.play(FadeOut(ones_box), FadeOut(step1), FadeOut(problem_text), FadeOut(solution_text))
        
        # Visual representation with base-10 blocks
        tens_label = Text("Tens", font_size=20, color=BLUE).shift(UP * 2 + RIGHT * 2)
        ones_label = Text("Ones", font_size=20, color=GREEN).shift(UP * 2 + RIGHT * 4)
        self.play(Write(tens_label), Write(ones_label))
        
        # 2 tens (rectangles)
        tens = VGroup(*[
            Rectangle(width=0.3, height=1.2, color=BLUE, fill_opacity=0.6).shift(RIGHT * (2 + i * 0.4) + UP * 0.5)
            for i in range(2)
        ])
        
        # 3 ones (small squares)
        ones = VGroup(*[
            Square(side_length=0.3, color=GREEN, fill_opacity=0.6).shift(RIGHT * (4 + i * 0.4) + UP * 0.5)
            for i in range(3)
        ])
        
        self.play(FadeIn(tens), FadeIn(ones))
        self.wait(1)
        
        # Borrow: Move one ten to ones
        borrow_text = Text("Borrow 1 ten = 10 ones", font_size=24, color=YELLOW)
        borrow_text.shift(DOWN * 1.5)
        self.play(Write(borrow_text))
        
        borrowed_ten = tens[1].copy()
        self.play(borrowed_ten.animate.shift(RIGHT * 1.5))
        self.play(FadeOut(tens[1]))
        
        # Convert ten to 10 ones
        new_ones = VGroup(*[
            Square(side_length=0.3, color=GREEN, fill_opacity=0.6).shift(RIGHT * (4 + i * 0.4) + DOWN * 0.5)
            for i in range(10)
        ])
        self.play(Transform(borrowed_ten, new_ones))
        self.wait(1)
        
        # Now we have 1 ten and 13 ones
        result_text = Text("Now: 1 ten + 13 ones", font_size=28, color=GREEN)
        result_text.shift(DOWN * 2.5)
        self.play(Transform(borrow_text, result_text))
        self.wait(1)
        
        # Clear visual aids
        self.play(
            FadeOut(tens), FadeOut(ones), FadeOut(borrowed_ten),
            FadeOut(tens_label), FadeOut(ones_label), FadeOut(borrow_text)
        )
        
        # Show updated problem
        updated_problem = MathTex(
            r"\begin{array}{r} \small{1}\cancel{2}^{1}3 \\ - 15 \\ \hline \end{array}",
            font_size=72
        )
        updated_problem.shift(LEFT * 3)
        self.play(Transform(problem, updated_problem))
        self.wait(1)
        
        # Now subtract
        final_step = Text("Now: 13 - 5 = 8, and 1 - 1 = 0", font_size=28, color=WHITE)
        final_step.shift(RIGHT * 1.5)
        self.play(Write(final_step))
        self.wait(1)
        
        # Show final answer
        answer = MathTex(
            r"\begin{array}{r} \small{1}\cancel{2}^{1}3 \\ - 15 \\ \hline 08 \end{array}",
            font_size=72,
            color=GREEN
        )
        answer.shift(LEFT * 3)
        self.play(Transform(problem, answer))
        self.wait(1)
        
        # Simplify to 8
        simple_answer = MathTex("23 - 15 = 8", font_size=60, color=GREEN)
        self.play(
            FadeOut(final_step),
            Transform(problem, simple_answer)
        )
        
        # Celebration
        celebration = Text("Perfect! 🎉", font_size=48, color=YELLOW)
        celebration.to_edge(DOWN)
        self.play(Write(celebration))
        
        self.wait(2)
