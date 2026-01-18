"""
Multiplication Tutorial - Manim Animation
Teaches multiplication (3 × 4 = 12) using arrays and repeated addition
"""

from manim import *

class MultiplicationTutorial(Scene):
    def construct(self):
        # Title
        title = Text("What is 3 × 4?", font_size=60, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))
        
        # Show problem
        problem = MathTex("3", r"\times", "4", "=", "?", font_size=72)
        self.play(Write(problem))
        self.wait(1)
        self.play(problem.animate.shift(UP * 2))
        
        # Explanation
        explanation = Text("Multiplication means 'groups of'", font_size=32, color=YELLOW)
        explanation.shift(UP * 0.5)
        self.play(Write(explanation))
        self.wait(1)
        
        # Show as repeated addition
        repeated = MathTex("3", r"\times", "4", "=", "4", "+", "4", "+", "4", font_size=48)
        repeated.shift(DOWN * 0.5)
        self.play(Write(repeated))
        self.wait(1)
        
        # Clear for visual
        self.play(FadeOut(explanation), FadeOut(repeated))
        
        # Create array of dots (3 rows × 4 columns)
        array_label = Text("3 rows of 4 dots each", font_size=28, color=WHITE)
        array_label.shift(UP * 0.5)
        self.play(Write(array_label))
        
        dots = VGroup()
        for row in range(3):
            for col in range(4):
                dot = Dot(
                    point=[col * 0.8 - 1.2, -row * 0.8 - 1, 0],
                    radius=0.15,
                    color=BLUE
                )
                dots.add(dot)
        
        # Animate dots appearing row by row
        for row in range(3):
            row_dots = VGroup(*[dots[row * 4 + col] for col in range(4)])
            row_label = Text(f"Row {row + 1}: 4 dots", font_size=20, color=YELLOW)
            row_label.next_to(row_dots, RIGHT, buff=0.5)
            self.play(FadeIn(row_dots), Write(row_label))
            self.wait(0.5)
            self.play(FadeOut(row_label))
        
        self.wait(1)
        
        # Highlight and count
        count_text = Text("Let's count all the dots!", font_size=28, color=YELLOW)
        count_text.shift(DOWN * 2.5)
        self.play(Write(count_text))
        
        # Count dots with animation
        counter = 0
        for dot in dots:
            counter += 1
            number = Text(str(counter), font_size=24, color=YELLOW)
            number.next_to(dot, UP, buff=0.1)
            self.play(
                dot.animate.set_color(GREEN).scale(1.3),
                Write(number),
                run_time=0.3
            )
            if counter < len(dots):
                self.play(FadeOut(number), run_time=0.1)
            else:
                final_number = number
        
        self.wait(1)
        
        # Show answer
        self.play(FadeOut(array_label), FadeOut(count_text), FadeOut(final_number))
        
        answer = MathTex("3", r"\times", "4", "=", "12", font_size=72, color=GREEN)
        answer.shift(UP * 2)
        self.play(Transform(problem, answer))
        
        # Show both representations
        array_eq = MathTex("3", r"\times", "4", "=", "4", "+", "4", "+", "4", "=", "12", font_size=40)
        array_eq.shift(UP * 0.5)
        self.play(Write(array_eq))
        
        # Celebration
        celebration = Text("Excellent! 🎉", font_size=48, color=YELLOW)
        celebration.shift(DOWN * 2.5)
        self.play(Write(celebration))
        
        # Final animation
        self.play(
            dots.animate.arrange_in_grid(rows=3, cols=4, buff=0.3).scale(0.8),
            run_time=1
        )
        
        self.wait(2)
